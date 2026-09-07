# Vite Preview WebSocket Repair — Final Validation

**Validated:** 7 September 2026

## Diagnosis

The managed preview proxy served the Vite client through its internal `localhost:5173` bridge but did not reliably forward the custom `/__vite_hmr` WebSocket upgrade to the application’s middleware-mode Vite process. As a result, the browser could load the page over HTTP yet log a failed WebSocket connection or “closed without opened” error during development preview initialization.

## Repair

Vite HMR is now deliberately disabled for the **development preview only**. The server explicitly removes Vite’s injected `@vite/client` module from the rendered HTML because Vite otherwise still injects a WebSocket client in middleware mode even when HMR is disabled. The application’s normal module, stylesheet, asset, API, and production traffic paths are unchanged. Development changes remain available after a normal browser refresh, without exposing readers to a failing HMR socket.

| Validation | Result |
| --- | --- |
| Served HTML | Passed. A local request after restart returned **zero** injected `/@vite/client` modules. |
| HTTPS managed preview | Passed. The reported preview URL loaded the full XTZ.News homepage after restart. |
| Fresh browser-console output | Passed. The post-repair preview load recorded no new Vite or WebSocket connection errors. |
| Regression tests | Passed. `pnpm test` completed **103 tests across 42 files**. |
| TypeScript | Passed. `pnpm check` completed without errors. |

This change does not open ports, modify published-site routing, or alter browser traffic outside the local development-preview environment.

