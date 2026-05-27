/**
 * Generate and upload AI images for all spotlight articles missing featured images.
 * Uses the Manus Forge image generation API.
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const FORGE_URL = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const FORGE_KEY = process.env.BUILT_IN_FORGE_API_KEY;

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get all spotlight articles with no image
const [posts] = await conn.query(
  "SELECT id, title, slug FROM posts WHERE slug LIKE 'spotlight-%' AND (featuredImageUrl IS NULL OR featuredImageUrl = '') ORDER BY id"
);
console.log(`Found ${posts.length} spotlight articles without images`);

function getImagePrompt(title) {
  const t = title.toLowerCase();
  if (t.includes('tezos x') || t.includes('evm') || t.includes('previewnet') || t.includes('roadmap')) {
    return "Futuristic blockchain network with interconnected blue nodes, Tezos ecosystem visualization, dark background with glowing blue connections, professional crypto technology art";
  } else if (t.includes('staking') || t.includes('defi') || t.includes('liquid') || t.includes('stez')) {
    return "Digital finance visualization with flowing cryptocurrency coins and blockchain nodes, blue gradient background, professional fintech illustration, Tezos ecosystem";
  } else if (t.includes('nft') || t.includes('art') || t.includes('gallery') || t.includes('museum') || t.includes('codex')) {
    return "Digital art gallery with glowing NFT frames on dark background, blockchain art exhibition, Tezos blue accent colors, modern contemporary art aesthetic";
  } else if (t.includes('protocol') || t.includes('upgrade') || t.includes('ushuaia') || t.includes('oxford') || t.includes('seoul') || t.includes('rio') || t.includes('tallinn')) {
    return "Abstract blockchain protocol upgrade visualization, nodes upgrading and connecting, Tezos blue color scheme, technical digital art, network evolution";
  } else if (t.includes('gaming') || t.includes('game') || t.includes('sugar') || t.includes('reaper')) {
    return "Blockchain gaming visualization with digital game elements and Tezos ecosystem, vibrant blue and purple colors, futuristic game world";
  } else if (t.includes('etherlink')) {
    return "Ethereum and Tezos blockchain bridge visualization, two chains connecting with blue energy, gradient background, technical blockchain art";
  } else if (t.includes('jstz') || t.includes('developer') || t.includes('build') || t.includes('risc') || t.includes('engine')) {
    return "Developer workspace with blockchain code on screens, Tezos logo, blue tech aesthetic, modern development environment, programming visualization";
  } else if (t.includes('community') || t.includes('ecosystem') || t.includes('month') || t.includes('glance')) {
    return "Global Tezos community network visualization, people connected by blockchain nodes, blue gradient, inclusive technology ecosystem";
  } else if (t.includes('uranium') || t.includes('metal') || t.includes('rail') || t.includes('gold')) {
    return "Blockchain tokenization of real-world assets, digital representation of metals and commodities, Tezos blue color scheme, professional fintech art";
  } else if (t.includes('wallet') || t.includes('checkup')) {
    return "Digital cryptocurrency wallet security visualization, Tezos blockchain, blue shield and lock icons, professional security technology art";
  } else if (t.includes('tezdev') || t.includes('conference') || t.includes('tezcon') || t.includes('summit')) {
    return "Blockchain developer conference visualization, Tezos community gathering, blue stage and presentation, technology event art";
  } else if (t.includes('hidden gems') || t.includes('tools') || t.includes('essentials')) {
    return "Collection of blockchain tools and gems visualization, Tezos ecosystem discovery, blue treasure chest with digital assets, technology exploration";
  } else if (t.includes('arthur') || t.includes('breitman') || t.includes('coinshares') || t.includes('interview')) {
    return "Professional blockchain leader interview visualization, Tezos founder discussion, blue corporate technology backdrop, professional portrait style";
  } else {
    return `Professional Tezos blockchain technology visualization for '${title.substring(0, 40)}', dark navy background with blue accents, digital innovation, modern crypto art`;
  }
}

async function generateAndUploadImage(title, slug) {
  const prompt = getImagePrompt(title);
  
  try {
    // Generate image via Manus Forge (correct endpoint)
    const forgeBase = FORGE_URL.endsWith('/') ? FORGE_URL : `${FORGE_URL}/`;
    const genEndpoint = new URL('images.v1.ImageService/GenerateImage', forgeBase).toString();
    const genResp = await fetch(genEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FORGE_KEY}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'connect-protocol-version': '1'
      },
      body: JSON.stringify({ prompt, original_images: [] })
    });
    
    if (!genResp.ok) {
      const err = await genResp.text();
      throw new Error(`Image gen failed: ${genResp.status} ${err.substring(0, 100)}`);
    }
    
    const genData = await genResp.json();
    
    // Handle base64 response from Forge API
    let imgBuffer;
    const b64 = genData.image?.b64Json || genData.b64Json || genData.data?.[0]?.b64_json;
    const imageUrl = genData.url || genData.images?.[0]?.url || genData.data?.[0]?.url;
    
    if (b64) {
      // Decode base64 image data directly
      imgBuffer = Buffer.from(b64, 'base64');
    } else if (imageUrl) {
      // Download from URL
      const imgResp = await fetch(imageUrl);
      if (!imgResp.ok) throw new Error(`Image download failed: ${imgResp.status}`);
      imgBuffer = await imgResp.arrayBuffer();
    } else {
      throw new Error(`No image data in response: ${JSON.stringify(genData).substring(0, 100)}`);
    }
    
    // Get presigned PUT URL for Manus Storage
    const presignUrl = new URL('v1/storage/presign/put', FORGE_URL + '/');
    presignUrl.searchParams.set('path', `spotlight-articles/${slug}.jpg`);
    const presignResp = await fetch(presignUrl, {
      headers: { Authorization: `Bearer ${FORGE_KEY}` }
    });
    if (!presignResp.ok) throw new Error(`Presign failed: ${presignResp.status}`);
    const { url: s3Url } = await presignResp.json();
    
    // Upload to S3
    const uploadResp = await fetch(s3Url, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: imgBuffer
    });
    if (!uploadResp.ok) throw new Error(`S3 upload failed: ${uploadResp.status}`);
    
    return `/manus-storage/spotlight-articles/${slug}.jpg`;
  } catch (e) {
    throw e;
  }
}

let success = 0, failed = 0;

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  console.log(`[${i+1}/${posts.length}] ${post.title.substring(0, 50)}...`);
  
  try {
    const imageUrl = await generateAndUploadImage(post.title, post.slug);
    await conn.query('UPDATE posts SET featuredImageUrl = ? WHERE id = ?', [imageUrl, post.id]);
    success++;
    console.log(`  ✓ Image stored: ${imageUrl}`);
  } catch (e) {
    console.log(`  ✗ Error: ${e.message}`);
    failed++;
  }
  
  // Small delay between generations
  await new Promise(r => setTimeout(r, 2000));
}

console.log(`\n✅ Done: ${success} images generated, ${failed} failed`);
await conn.end();
