#!/usr/bin/env python3
"""
Pipeline to process remaining spotlight.tezos.com articles using Manus built-in LLM (free).
1. Scrape full content from spotlight.tezos.com
2. Rewrite with Manus Forge LLM (Gemini 2.5 Pro) from a different angle
3. Generate AI featured image via Manus Forge
4. Publish as backdated post on xtz.news
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re
import sys
import mysql.connector
import urllib.parse
from datetime import datetime

# Config
FORGE_URL = os.environ.get('BUILT_IN_FORGE_API_URL', '').rstrip('/')
FORGE_KEY = os.environ.get('BUILT_IN_FORGE_API_KEY', '')
DB_URL = os.environ.get('DATABASE_URL', '')
PROGRESS_FILE = '/tmp/spotlight_manus_progress.json'
ARTICLES_FILE = '/tmp/spotlight_remaining.json'

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

# Load articles list
with open(ARTICLES_FILE) as f:
    articles = json.load(f)

# Load progress
progress = {}
if os.path.exists(PROGRESS_FILE):
    with open(PROGRESS_FILE) as f:
        progress = json.load(f)
    done_count = sum(1 for v in progress.values() if v.get('status') == 'done')
    print(f"Resuming: {done_count} articles already done")

def clean_text(text):
    """Clean UTF-8 encoding artifacts"""
    if not text:
        return text
    return (text
        .replace('\u00c2\u00a0', ' ')
        .replace('\u00c2 ', ' ')
        .replace('\u00e2\u0080\u0093', '\u2013')
        .replace('\u00e2\u0080\u0099', '\u2019')
        .replace('\u00e2\u0080\u009c', '\u201c')
        .replace('\u00e2\u0080\u009d', '\u201d')
        .replace('\u00e2\u0080\u00a6', '\u2026')
        .strip()
    )

def scrape_article(url):
    """Scrape full article content from spotlight.tezos.com"""
    resp = requests.get(url, headers=headers, timeout=20)
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    title = ''
    for sel in ['h1', '.post-title', '.article-title']:
        el = soup.select_one(sel)
        if el:
            title = clean_text(el.get_text(strip=True))
            break
    
    pub_date = ''
    for sel in ['time', '.post-date', '[datetime]']:
        el = soup.select_one(sel)
        if el:
            pub_date = el.get('datetime', '') or el.get_text(strip=True)
            break
    
    content = ''
    for sel in ['.gh-content', '.post-content', '.article-content', '.entry-content', '.content-body', 'article', 'main', 'body']:
        el = soup.select_one(sel)
        if el:
            for tag in el.find_all(['nav', 'header', 'footer', 'script', 'style', 'aside', 'form']):
                tag.decompose()
            text = el.get_text(separator='\n', strip=True)
            if len(text) > 50:
                content = text
                break
    
    excerpt = ''
    for sel in ['meta[name="description"]', 'meta[property="og:description"]']:
        el = soup.select_one(sel)
        if el:
            excerpt = el.get('content', '')
            break
    
    return {
        'title': title,
        'content': content[:5000],
        'pub_date': pub_date,
        'excerpt': excerpt,
        'url': url
    }

ANGLES = [
    "Rewrite this from the perspective of a Tezos developer explaining to other builders",
    "Rewrite this as a news analysis piece focusing on the broader implications for the blockchain industry",
    "Rewrite this from an investor's perspective, focusing on what this means for XTZ value and ecosystem growth",
    "Rewrite this as an educational explainer for someone new to Tezos and blockchain technology",
    "Rewrite this focusing on the technical innovation and how it compares to other blockchain solutions",
    "Rewrite this from a community perspective, highlighting what this means for Tezos users and participants",
    "Rewrite this as a forward-looking analysis of what this development means for Tezos in 2025 and beyond",
    "Rewrite this focusing on the real-world use cases and practical applications this enables",
    "Rewrite this as a deep-dive into the specific technical mechanisms and how they work",
    "Rewrite this from the perspective of DeFi users and what this means for decentralised finance on Tezos",
]

def rewrite_with_manus_llm(article_data, angle_index):
    """Rewrite article with Manus built-in LLM (Gemini 2.5 Pro)"""
    angle = ANGLES[angle_index % len(ANGLES)]
    
    prompt = f"""You are a Tezos news journalist. {angle}.

IMPORTANT RULES:
- Keep ALL specific facts, numbers, dates, names, and technical details EXACTLY the same
- Do NOT change any direct quotes
- Change the general flow, structure, introduction, transitions, and commentary
- Make it feel like a completely different article covering the same story
- Write in a professional news/blog style
- Length should be similar to the original (aim for 400-700 words)
- Output ONLY the article HTML (use <p>, <h2>, <h3>, <strong>, <em> tags)
- Do NOT include a title in the output
- Do NOT include any preamble or explanation

ORIGINAL ARTICLE TITLE: {article_data['title']}

ORIGINAL CONTENT:
{article_data['content'][:3500]}

Write the rewritten article now:"""

    # Use Manus Forge LLM API
    resp = requests.post(
        f"{FORGE_URL}/v1/chat/completions",
        headers={
            'Authorization': f'Bearer {FORGE_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'messages': [
                {'role': 'user', 'content': prompt}
            ],
            'max_tokens': 2000
        },
        timeout=60
    )
    
    if not resp.ok:
        raise Exception(f"LLM API error: {resp.status_code} {resp.text[:100]}")
    
    data = resp.json()
    return data['choices'][0]['message']['content']

def get_image_prompt(title):
    t = title.lower()
    if 'tezos x' in t or 'evm' in t or 'previewnet' in t or 'roadmap' in t:
        return "Futuristic blockchain network with interconnected blue nodes, Tezos ecosystem visualization, dark background with glowing blue connections, professional crypto technology art"
    elif 'staking' in t or 'defi' in t or 'liquid' in t:
        return "Digital finance visualization with flowing cryptocurrency coins and blockchain nodes, blue gradient background, professional fintech illustration"
    elif 'nft' in t or 'art' in t or 'gallery' in t or 'museum' in t:
        return "Digital art gallery with glowing NFT frames on dark background, blockchain art exhibition, Tezos blue accent colors, modern contemporary art aesthetic"
    elif 'protocol' in t or 'upgrade' in t:
        return "Abstract blockchain protocol upgrade visualization, nodes upgrading and connecting, Tezos blue color scheme, technical digital art"
    elif 'gaming' in t or 'game' in t:
        return "Blockchain gaming visualization with digital game elements, vibrant blue and purple colors, futuristic game world"
    elif 'etherlink' in t:
        return "Ethereum and Tezos blockchain bridge visualization, two chains connecting with blue energy, gradient background, technical blockchain art"
    elif 'jstz' in t or 'developer' in t or 'build' in t:
        return "Developer workspace with blockchain code on screens, Tezos logo, blue tech aesthetic, modern development environment"
    elif 'uranium' in t or 'metal' in t or 'gold' in t:
        return "Blockchain tokenization of real-world assets, digital representation of metals and commodities, Tezos blue color scheme, professional fintech art"
    else:
        return f"Professional Tezos blockchain technology visualization, dark navy background with blue accents, digital innovation, modern crypto art"

def generate_and_upload_image(title, slug):
    """Generate AI image and upload to Manus Storage"""
    prompt = get_image_prompt(title)
    
    forge_base = FORGE_URL + '/' if not FORGE_URL.endswith('/') else FORGE_URL
    gen_endpoint = forge_base + 'images.v1.ImageService/GenerateImage'
    
    gen_resp = requests.post(
        gen_endpoint,
        headers={
            'Authorization': f'Bearer {FORGE_KEY}',
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'connect-protocol-version': '1'
        },
        json={'prompt': prompt, 'original_images': []},
        timeout=60
    )
    
    if not gen_resp.ok:
        raise Exception(f"Image gen failed: {gen_resp.status_code}")
    
    gen_data = gen_resp.json()
    b64 = gen_data.get('image', {}).get('b64Json', '')
    
    if not b64:
        raise Exception("No image data in response")
    
    import base64
    img_bytes = base64.b64decode(b64)
    
    # Get presigned PUT URL
    presign_resp = requests.get(
        f"{FORGE_URL}/v1/storage/presign/put",
        headers={'Authorization': f'Bearer {FORGE_KEY}'},
        params={'path': f'spotlight-articles/spotlight-{slug}.jpg'},
        timeout=15
    )
    if not presign_resp.ok:
        raise Exception(f"Presign failed: {presign_resp.status_code}")
    
    s3_url = presign_resp.json().get('url', '')
    if not s3_url:
        raise Exception("No presign URL")
    
    upload_resp = requests.put(s3_url, data=img_bytes, headers={'Content-Type': 'image/jpeg'}, timeout=30)
    if not upload_resp.ok:
        raise Exception(f"S3 upload failed: {upload_resp.status_code}")
    
    return f'/manus-storage/spotlight-articles/spotlight-{slug}.jpg'

def get_db_conn():
    parsed = urllib.parse.urlparse(DB_URL)
    return mysql.connector.connect(
        host=parsed.hostname,
        port=parsed.port or 3306,
        user=parsed.username,
        password=parsed.password,
        database=parsed.path.lstrip('/').split('?')[0],
        ssl_verify_cert=False
    )

def publish_article(title, content, pub_date, excerpt, image_url, slug):
    conn = get_db_conn()
    cursor = conn.cursor()
    
    # Parse date
    pub_date_sql = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    if pub_date:
        for fmt in ['%Y-%m-%d', '%B %d, %Y', '%d %B %Y']:
            try:
                dt = datetime.strptime(pub_date[:10], fmt)
                pub_date_sql = dt.strftime('%Y-%m-%d %H:%M:%S')
                break
            except:
                continue
    
    # Check slug exists
    cursor.execute("SELECT id FROM posts WHERE slug = %s", (f'spotlight-{slug}',))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return None  # Already exists
    
    cursor.execute("""
        INSERT INTO posts (title, slug, content, excerpt, featuredImageUrl, status, publishedAt, createdAt, updatedAt)
        VALUES (%s, %s, %s, %s, %s, 'publish', %s, NOW(), NOW())
    """, (title, f'spotlight-{slug}', content, excerpt[:500] if excerpt else '', image_url, pub_date_sql))
    
    post_id = cursor.lastrowid
    cursor.execute("INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (%s, 1)", (post_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return post_id

print(f"Starting pipeline for {len(articles)} articles using Manus LLM...")
done_count = sum(1 for v in progress.values() if v.get('status') == 'done')
print(f"Already processed: {done_count}")

for i, article in enumerate(articles):
    slug = article['slug']
    
    if slug in progress and progress[slug].get('status') == 'done':
        continue
    
    print(f"\n[{i+1}/{len(articles)}] {slug[:60]}")
    
    try:
        # Scrape
        article_data = scrape_article(article['url'])
        if not article_data['content'] or len(article_data['content']) < 50:
            progress[slug] = {'status': 'failed', 'reason': 'no_content'}
            continue
        
        print(f"  Title: {article_data['title'][:50]}")
        
        # Rewrite with Manus LLM
        print(f"  Rewriting with Manus LLM (angle {i % len(ANGLES)})...")
        rewritten = rewrite_with_manus_llm(article_data, i)
        
        # Generate image
        print(f"  Generating image...")
        try:
            image_url = generate_and_upload_image(article_data['title'], slug)
        except Exception as e:
            print(f"  Image failed: {e} — continuing without image")
            image_url = ''
        
        # Publish
        print(f"  Publishing...")
        post_id = publish_article(
            title=article_data['title'],
            content=rewritten,
            pub_date=article_data['pub_date'],
            excerpt=article_data['excerpt'],
            image_url=image_url,
            slug=slug
        )
        
        if post_id:
            print(f"  ✓ Published! Post ID: {post_id}")
            progress[slug] = {'status': 'done', 'post_id': post_id}
        else:
            print(f"  ✓ Already exists, skipping")
            progress[slug] = {'status': 'done', 'post_id': 'exists'}
        
        # Save progress every 10 articles
        if i % 10 == 0:
            with open(PROGRESS_FILE, 'w') as f:
                json.dump(progress, f, indent=2)
        
        time.sleep(2)
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        progress[slug] = {'status': 'failed', 'reason': str(e)[:200]}
        with open(PROGRESS_FILE, 'w') as f:
            json.dump(progress, f, indent=2)
        time.sleep(1)

# Final save
with open(PROGRESS_FILE, 'w') as f:
    json.dump(progress, f, indent=2)

done = sum(1 for v in progress.values() if v.get('status') == 'done')
failed = sum(1 for v in progress.values() if v.get('status') == 'failed')
print(f"\n✅ Complete: {done} published, {failed} failed")
