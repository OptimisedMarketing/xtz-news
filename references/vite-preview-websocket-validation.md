# Vite Preview WebSocket Repair — Validation Record

**Reported:** 4 September 2026, 03:30 Europe/London  
**Affected development route:** `/?from_webdev=1`

| Checkpoint | Result |
| --- | --- |
| Reported cause | The browser attempted to open Vite HMR against the middleware default `localhost:5173`, which is unreachable from the HTTPS preview hostname. |
| Corrective change | `server/_core/vite.ts` now declares a browser-facing `wss` connection through port `443`, while keeping the same in-process HMR server. Production serving remains unchanged. |
| Restart | Development server restarted successfully and TypeScript reports no errors. |
| Browser recheck | The first direct recheck received a temporary gateway rate-limit response, rather than the prior HMR failure. The managed preview capture then loaded the homepage successfully. |
| Live HMR check | Passed. A harmless file-watch event produced Vite’s `hmr update /src/pages/Home.tsx` event at 03:33:30, confirming that a connected preview client received the update through the repaired proxy path. |
| Final regression check | Passed. The full suite completed 75 tests across 32 files and TypeScript compilation completed without errors after the HMR change. |

The repair does not open ports, alter production traffic, or introduce a fixed server-listening port.
