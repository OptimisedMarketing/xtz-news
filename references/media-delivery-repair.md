# Media Delivery Repair — 12 August 2026

The custom production domain serves `/manus-storage/*` as a signed redirect, while the development application can stream the same keys successfully. This caused image elements on the custom-domain homepage to fail or remain blank.

The repair introduces a same-origin `/media/*` relay that presigns and streams the immutable storage object, then maps editorial `/manus-storage/*` browser URLs to that relay.

Validation confirmed the relay returns `200` with the correct MIME type for WebP, JPEG, and PNG assets. The Etherlink 7.0 Ganesha source image was also visually verified as intact (2560 × 1440 PNG); it is not a corrupted source asset.

Browser validation on the development preview confirmed that the Teztree homepage hero and latest-news card images render in-page through `/media/*`. The Etherlink 7.0 Ganesha article hero also renders in-page through the relay after adding the image paint fallback. After related-post deduplication, the browser console recorded zero errors after the hot update.

## Saved visual proof

- Homepage URL: `https://3000-iw0i3na1gswojcqq6g463-df6a259a.us2.manus.computer/` — screenshot: `/tmp/xtz-media-home-proof.png`. The Tezos Art hero and the visible Latest News card images are rendered in-page.
- Article URL: `https://3000-iw0i3na1gswojcqq6g463-df6a259a.us2.manus.computer/etherlink-70-ganesha-unites-tezos-and-evm-ecosystems` — screenshot: `/tmp/xtz-media-article-proof.png`. The Etherlink 7.0 Ganesha hero is rendered in-page.

## Live custom-domain proof

- `https://xtz.news/` — screenshot: `/tmp/xtz-live-home-proof.png`. The Art on Tezos homepage hero and the visible Teztree, art, and Ganesha card images render in-page.
- `https://www.xtz.news/etherlink-70-ganesha-unites-tezos-and-evm-ecosystems` — screenshot: `/tmp/xtz-live-article-proof.png`. `www.xtz.news` redirects to the canonical domain and renders the Etherlink 7.0 Ganesha hero in-page.
- Both custom domains return the same relayed hero asset with a `200` image response. `www.xtz.news` first returns a canonical `301` redirect to `xtz.news`, then the image response is served from the same relay with a one-year public cache policy.

Direct verification in the connected reader browser also confirmed that `xtz.news/` visibly renders the homepage Teztree hero and latest-news card imagery. Opening the Ganesha article through `www.xtz.news` redirected to `xtz.news` and visibly rendered the full Etherlink 7.0 Ganesha hero in-page.
