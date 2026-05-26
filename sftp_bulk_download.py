#!/usr/bin/env python3
"""
Bulk download all WordPress images from Fasthosts SFTP.
Builds a complete index of the uploads directory first, then downloads by matching filename.
"""
import paramiko
import os
import sys
import json
import re
import time

SFTP_HOST = 'access-5016615871.webspace-host.com'
SFTP_USER = 'a2363231'
SFTP_PASS = "Ya7jz}u+H)fGVSy$"
TMPDIR = '/tmp/wp-images'
INDEX_FILE = '/tmp/wp-images-index.json'

os.makedirs(TMPDIR, exist_ok=True)

def connect():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SFTP_HOST, port=22, username=SFTP_USER, password=SFTP_PASS, timeout=30)
    return ssh, ssh.open_sftp()

def build_index(sftp):
    """Build a complete index of all files in uploads/"""
    print("Building index of all WordPress uploads...", flush=True)
    index = {}  # basename -> full_path
    
    try:
        years = sftp.listdir('uploads')
    except Exception as e:
        print(f"Error listing uploads: {e}", flush=True)
        return index
    
    for year in sorted(years):
        if not year.isdigit():
            continue
        try:
            months = sftp.listdir(f'uploads/{year}')
        except:
            continue
        for month in sorted(months):
            if not month.isdigit():
                continue
            try:
                files = sftp.listdir(f'uploads/{year}/{month}')
                for f in files:
                    index[f] = f'uploads/{year}/{month}/{f}'
            except:
                continue
    
    print(f"Index built: {len(index)} files found", flush=True)
    return index

def strip_hash(filename):
    """Remove the _HASH suffix from filename: name_a1b2c3d4.jpg -> name.jpg"""
    base, ext = os.path.splitext(filename)
    base_no_hash = re.sub(r'_[a-f0-9]{8}$', '', base)
    return base_no_hash + ext

# Load or build index
if os.path.exists(INDEX_FILE):
    with open(INDEX_FILE) as f:
        index = json.load(f)
    print(f"Loaded existing index: {len(index)} files", flush=True)
else:
    ssh, sftp = connect()
    index = build_index(sftp)
    with open(INDEX_FILE, 'w') as f:
        json.dump(index, f)
    sftp.close()
    ssh.close()

# Read filenames to download from stdin
filenames = json.loads(sys.argv[1]) if len(sys.argv) > 1 else []
print(f"Downloading {len(filenames)} files...", flush=True)

ssh, sftp = connect()
results = {}
downloaded = 0
not_found = 0

for i, filename in enumerate(filenames):
    local_path = os.path.join(TMPDIR, filename)
    
    # Skip if already downloaded and valid
    if os.path.exists(local_path) and os.path.getsize(local_path) > 100:
        # Verify it's not HTML
        with open(local_path, 'rb') as f:
            header = f.read(15)
        if b'<!doctype' not in header.lower() and b'<html' not in header.lower():
            results[filename] = local_path
            downloaded += 1
            continue
    
    # Find the file in the index
    wp_filename = strip_hash(filename)
    remote_path = index.get(wp_filename)
    
    if not remote_path:
        # Try URL-decoded version
        from urllib.parse import unquote
        wp_filename_decoded = strip_hash(unquote(filename))
        remote_path = index.get(wp_filename_decoded)
    
    if not remote_path:
        results[filename] = None
        not_found += 1
        if not_found <= 20:
            print(f"  NOT FOUND: {wp_filename}", flush=True)
        continue
    
    try:
        sftp.get(remote_path, local_path)
        # Verify it's a real image
        with open(local_path, 'rb') as f:
            header = f.read(15)
        if b'<!doctype' in header.lower() or b'<html' in header.lower():
            os.remove(local_path)
            results[filename] = None
            not_found += 1
            print(f"  HTML content (not image): {filename}", flush=True)
        else:
            results[filename] = local_path
            downloaded += 1
    except Exception as e:
        results[filename] = None
        not_found += 1
        print(f"  Error downloading {filename}: {e}", flush=True)
    
    if (i + 1) % 100 == 0:
        print(f"Progress: {i+1}/{len(filenames)} - {downloaded} downloaded, {not_found} not found", flush=True)

sftp.close()
ssh.close()

print(f"\nDone: {downloaded} downloaded, {not_found} not found", flush=True)
print(json.dumps(results))
