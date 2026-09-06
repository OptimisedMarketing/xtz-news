# Vite Preview WebSocket Repair — Validation Record

**Reported:** 4 September 2026, 03:30 Europe/London  
**Affected development route:** `/?from_webdev=1`

| Checkpoint | Result |
| --- | --- |
| Original cause | The browser was given connection settings that did not work consistently across the local HTTP preview and the HTTPS preview proxy. Forcing `wss` and port `443` also made local preview clients attempt an incompatible encrypted connection. |
| Renewed corrective change | `server/_core/vite.ts` now attaches HMR to the existing dev server at the dedicated `/__vite_hmr` path, while allowing the Vite client to derive `ws` or `wss` and the correct port from the loaded preview origin. The server’s URL-normalisation middleware explicitly bypasses this endpoint. Production serving remains unchanged. |
| Restart | Development server restarted successfully and TypeScript reports no errors. |
| Browser recheck | The first direct recheck received a temporary gateway rate-limit response, rather than the prior HMR failure. The managed preview capture then loaded the homepage successfully. |
| Live HMR check | Passed. A harmless file-watch event produced Vite’s `hmr update /src/pages/Home.tsx` event at 03:33:30, confirming that a connected preview client received the update through the repaired proxy path. |
| Final regression check | Passed. The full suite completed 75 tests across 32 files and TypeScript compilation completed without errors after the HMR change. |
| Renewed connection check | Passed. The managed local preview logged `[vite] connected.` at 18:58:57, the HTTPS preview loaded at 18:59, and an intentional stylesheet watch event delivered `hmr update /src/index.css` to the connected client at 18:59:48 without a new WebSocket error. |
| Current regression check | Passed. The full suite completed 80 tests across 34 files and TypeScript compilation completed without errors after the origin-aware repair. |

The repair does not open ports, alter production traffic, or introduce a fixed server-listening port.
