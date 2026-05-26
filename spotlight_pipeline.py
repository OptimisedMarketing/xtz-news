#!/usr/bin/env python3
"""
Pipeline to:
1. Scrape full content from spotlight.tezos.com articles
2. Rewrite each with Claude Opus from a different angle
3. Generate AI featured image via Manus Forge
4. Publish as backdated post on xtz.news via tRPC API
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re
import sys
import anthropic
from datetime import datetime

# Config
ANTHROPIC_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
FORGE_URL = os.environ.get('BUILT_IN_FORGE_API_URL', '').rstrip('/')
FORGE_KEY = os.environ.get('BUILT_IN_FORGE_API_KEY', '')
DB_URL = os.environ.get('DATABASE_URL', '')
SITE_URL = 'https://xtz.news'
PROGRESS_FILE = '/tmp/spotlight_progress.json'
ARTICLES_FILE = '/tmp/spotlight_articles.json'

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

# Load articles list
with open(ARTICLES_FILE) as f:
    articles = json.load(f)

# Load progress
progress = {}
if os.path.exists(PROGRESS_FILE):
    with open(PROGRESS_FILE) as f:
        progress = json.load(f)
    print(f"Resuming: {len(progress)} articles already processed")

def clean_text(text):
    """Clean UTF-8 encoding artifacts from text"""
    if not text:
        return text
    return (text
        .replace('\u00c2\u00a0', ' ')  # Â + non-breaking space
        .replace('\u00c2 ', ' ')        # Â + space
        .replace('\u00e2\u0080\u0093', '\u2013')  # em dash
        .replace('\u00e2\u0080\u0099', '\u2019')  # right single quote
        .replace('\u00e2\u0080\u009c', '\u201c')  # left double quote
        .replace('\u00e2\u0080\u009d', '\u201d')  # right double quote
        .replace('\u00e2\u0080\u00a6', '\u2026')  # ellipsis
        .strip()
    )

def scrape_article(url):
    """Scrape full article content from spotlight.tezos.com"""
    resp = requests.get(url, headers=headers, timeout=20)
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    # Get title
    title = ''
    for sel in ['h1', '.post-title', '.article-title']:
        el = soup.select_one(sel)
        if el:
            title = el.get_text(strip=True)
            break
    
    # Get publish date
    pub_date = ''
    for sel in ['time', '.post-date', '.article-date', '[datetime]']:
        el = soup.select_one(sel)
        if el:
            pub_date = el.get('datetime', '') or el.get_text(strip=True)
            break
    
    # Get author
    author = 'Tezos Spotlight'
    for sel in ['.author-name', '.byline', '.post-author']:
        el = soup.select_one(sel)
        if el:
            author = el.get_text(strip=True)
            break
    
    # Get main content
    content = ''
    for sel in ['.post-content', '.article-content', '.gh-content', 'article', 'main']:
        el = soup.select_one(sel)
        if el:
            # Remove nav, header, footer, scripts
            for tag in el.find_all(['nav', 'header', 'footer', 'script', 'style', 'aside']):
                tag.decompose()
            content = el.get_text(separator='\n', strip=True)
            if len(content) > 200:
                break
    
    # Get featured image
    featured_image = ''
    for sel in ['.post-feature-image img', '.article-image img', 'article img', '.gh-article-image img']:
        el = soup.select_one(sel)
        if el:
            featured_image = el.get('src', '') or el.get('data-src', '')
            if featured_image and not featured_image.startswith('http'):
                featured_image = 'https://spotlight.tezos.com' + featured_image
            break
    
    # Get excerpt/description
    excerpt = ''
    for sel in ['meta[name="description"]', 'meta[property="og:description"]']:
        el = soup.select_one(sel)
        if el:
            excerpt = el.get('content', '')
            break
    
    return {
        'title': clean_text(title),
        'content': content[:8000],  # Limit content length for Claude
        'pub_date': pub_date,
        'author': author,
        'featured_image': featured_image,
        'excerpt': excerpt,
        'url': url
    }

# Different rewriting angles to use for each article
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

def rewrite_with_claude(article_data, angle_index):
    """Rewrite article with Claude Opus from a specific angle"""
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    
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
- Do NOT include a title in the output (it will be added separately)
- Do NOT include any preamble or explanation

ORIGINAL ARTICLE TITLE: {article_data['title']}

ORIGINAL CONTENT:
{article_data['content'][:4000]}

Write the rewritten article now:"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return message.content[0].text

def generate_image_prompt(title, content_preview):
    """Generate an image prompt for the article"""
    # Create a concise image prompt based on the article topic
    keywords = title.lower()
    
    if 'tezos x' in keywords or 'evm' in keywords or 'previewnet' in keywords:
        return "Futuristic blockchain network with interconnected nodes, Tezos blue and purple color scheme, digital technology visualization, professional crypto art"
    elif 'staking' in keywords or 'defi' in keywords or 'liquid' in keywords:
        return "Digital finance visualization with flowing coins and blockchain nodes, Tezos ecosystem, blue gradient, professional fintech illustration"
    elif 'nft' in keywords or 'art' in keywords or 'digital art' in keywords:
        return "Digital art gallery with NFT frames glowing on dark background, blockchain art, Tezos blue accent colors, modern gallery aesthetic"
    elif 'protocol' in keywords or 'upgrade' in keywords or 'ushuaia' in keywords:
        return "Abstract blockchain protocol upgrade visualization, nodes connecting and upgrading, Tezos blue color scheme, technical digital art"
    elif 'gaming' in keywords or 'game' in keywords:
        return "Blockchain gaming visualization with digital game elements, Tezos ecosystem, vibrant colors, futuristic game world"
    elif 'etherlink' in keywords:
        return "Ethereum and Tezos blockchain bridge visualization, two chains connecting, blue and purple gradient, technical blockchain art"
    elif 'developer' in keywords or 'build' in keywords or 'jstz' in keywords:
        return "Developer workspace with blockchain code on screens, Tezos logo, blue tech aesthetic, modern development environment"
    elif 'community' in keywords or 'ecosystem' in keywords:
        return "Global Tezos community network visualization, people connected by blockchain nodes, blue gradient, inclusive technology"
    else:
        return f"Professional blockchain technology visualization for '{title[:50]}', Tezos blue color scheme, digital innovation, modern crypto art"

def generate_ai_image(title, content_preview):
    """Generate AI image via Manus Forge image generation API"""
    prompt = generate_image_prompt(title, content_preview)
    
    try:
        resp = requests.post(
            f"{FORGE_URL}/v1/image/generate",
            headers={
                'Authorization': f'Bearer {FORGE_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'prompt': prompt,
                'width': 1200,
                'height': 630
            },
            timeout=60
        )
        
        if resp.ok:
            data = resp.json()
            return data.get('url', '') or data.get('data', [{}])[0].get('url', '')
    except Exception as e:
        print(f"  Image generation error: {e}")
    
    return ''

def upload_image_to_storage(image_url, slug):
    """Download image and upload to Manus Storage"""
    if not image_url:
        return ''
    
    try:
        # Download the image
        img_resp = requests.get(image_url, timeout=30)
        if not img_resp.ok:
            return ''
        
        content_type = img_resp.headers.get('content-type', 'image/jpeg')
        
        # Get presigned PUT URL
        presign_resp = requests.get(
            f"{FORGE_URL}/v1/storage/presign/put",
            headers={'Authorization': f'Bearer {FORGE_KEY}'},
            params={'path': f'spotlight-articles/{slug}.jpg'},
            timeout=15
        )
        
        if not presign_resp.ok:
            return ''
        
        s3_url = presign_resp.json().get('url', '')
        if not s3_url:
            return ''
        
        # Upload to S3
        upload_resp = requests.put(
            s3_url,
            data=img_resp.content,
            headers={'Content-Type': content_type},
            timeout=30
        )
        
        if upload_resp.ok:
            return f'/manus-storage/spotlight-articles/{slug}.jpg'
    except Exception as e:
        print(f"  Storage upload error: {e}")
    
    return ''

def publish_article(title, content, pub_date, excerpt, image_url, slug, original_url):
    """Publish article to xtz.news database directly via mysql"""
    import mysql.connector
    import urllib.parse
    
    # Parse DB URL
    # Format: mysql://user:pass@host:port/dbname?ssl=...
    db_url = DB_URL
    parsed = urllib.parse.urlparse(db_url)
    
    ssl_config = {}
    if 'ssl' in db_url:
        ssl_config = {'ssl_verify_cert': False}
    
    conn = mysql.connector.connect(
        host=parsed.hostname,
        port=parsed.port or 3306,
        user=parsed.username,
        password=parsed.password,
        database=parsed.path.lstrip('/').split('?')[0],
        **ssl_config
    )
    
    cursor = conn.cursor()
    
    # Parse publish date
    try:
        if pub_date:
            # Try various date formats
            for fmt in ['%Y-%m-%d', '%B %d, %Y', '%d %B %Y', '%Y-%m-%dT%H:%M:%S']:
                try:
                    dt = datetime.strptime(pub_date[:10], fmt[:len(pub_date[:10])])
                    pub_date_sql = dt.strftime('%Y-%m-%d %H:%M:%S')
                    break
                except:
                    continue
            else:
                pub_date_sql = pub_date
        else:
            pub_date_sql = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    except:
        pub_date_sql = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Check if slug already exists
    cursor.execute("SELECT id FROM posts WHERE slug = %s", (slug,))
    if cursor.fetchone():
        print(f"  Slug already exists: {slug}")
        cursor.close()
        conn.close()
        return False
    
    # Insert post
    cursor.execute("""
        INSERT INTO posts (title, slug, content, excerpt, featuredImageUrl, status, publishedAt, createdAt, updatedAt)
        VALUES (%s, %s, %s, %s, %s, 'publish', %s, NOW(), NOW())
    """, (title, slug, content, excerpt[:500] if excerpt else '', image_url, pub_date_sql))
    
    post_id = cursor.lastrowid
    
    # Link to "Latest News" category (id=1)
    cursor.execute("INSERT IGNORE INTO post_categories (postId, categoryId) VALUES (%s, 1)", (post_id,))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return post_id

# Install mysql-connector if needed
try:
    import mysql.connector
except ImportError:
    os.system('pip3 install mysql-connector-python -q')
    import mysql.connector

print(f"Starting pipeline for {len(articles)} articles...")
print(f"Already processed: {len(progress)}")

for i, article in enumerate(articles):
    slug = article['slug']
    
    if slug in progress:
        print(f"[{i+1}/50] Skipping (already done): {slug}")
        continue
    
    print(f"\n[{i+1}/50] Processing: {slug}")
    
    try:
        # Step 1: Scrape article content
        print(f"  Scraping content...")
        article_data = scrape_article(article['url'])
        
        if not article_data['content'] or len(article_data['content']) < 100:
            print(f"  ✗ No content found, skipping")
            progress[slug] = {'status': 'failed', 'reason': 'no_content'}
            continue
        
        print(f"  Title: {article_data['title'][:60]}")
        
        # Step 2: Rewrite with Claude
        print(f"  Rewriting with Claude Opus (angle {i % len(ANGLES)})...")
        rewritten_content = rewrite_with_claude(article_data, i)
        
        # Step 3: Generate AI image
        print(f"  Generating AI image...")
        image_url = generate_ai_image(article_data['title'], article_data['content'][:500])
        
        if image_url:
            print(f"  Uploading image to storage...")
            stored_image_url = upload_image_to_storage(image_url, slug)
            if stored_image_url:
                image_url = stored_image_url
        
        # Step 4: Publish to xtz.news
        print(f"  Publishing to xtz.news...")
        post_id = publish_article(
            title=article_data['title'],
            content=rewritten_content,
            pub_date=article_data['pub_date'],
            excerpt=article_data['excerpt'],
            image_url=image_url,
            slug=f"spotlight-{slug}",  # Prefix to avoid slug conflicts
            original_url=article['url']
        )
        
        if post_id:
            print(f"  ✓ Published! Post ID: {post_id}")
            progress[slug] = {'status': 'done', 'post_id': post_id}
        else:
            print(f"  ✗ Failed to publish (slug conflict?)")
            progress[slug] = {'status': 'failed', 'reason': 'publish_failed'}
        
        # Save progress
        with open(PROGRESS_FILE, 'w') as f:
            json.dump(progress, f, indent=2)
        
        # Rate limiting - wait between articles
        time.sleep(3)
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        progress[slug] = {'status': 'failed', 'reason': str(e)}
        with open(PROGRESS_FILE, 'w') as f:
            json.dump(progress, f, indent=2)
        time.sleep(2)

done = sum(1 for v in progress.values() if v.get('status') == 'done')
failed = sum(1 for v in progress.values() if v.get('status') == 'failed')
print(f"\n✅ Pipeline complete: {done} published, {failed} failed")
