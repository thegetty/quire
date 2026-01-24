# Static File Server Module

A lightweight static file server for serving built Quire publications locally.

## Purpose

This module provides a simple HTTP server for the `quire serve` command, allowing users to preview their built site (`_site/`) before deployment.

## Usage

```javascript
import { serve } from '#lib/server/index.js'

const { url, stop } = await serve('/path/to/_site', {
  port: 8080,
  quiet: false
})

console.log(`Serving at ${url}`)

// When done
await stop()
```

## Limitations

**Do not use this server in production.** It is designed for local development and review only.

Known limitations:

| Limitation | Description |
|------------|-------------|
| No HTTPS | HTTP only; no TLS/SSL support |
| No cache headers | No Cache-Control, ETag, or Last-Modified headers |
| No compression | Files are served uncompressed (no gzip/brotli) |
| No directory listing | Returns 404 for directories without index.html |
| Single-threaded | No clustering or worker threads |
| Synchronous file reads | Blocks on `fs.readFileSync()` for simplicity |
| No logging | Only debug output via `DEBUG=quire:lib:server` |
| Basic MIME types | Supports a limited set of web asset types |

For production deployments, use a proper web server (nginx, Apache) or static hosting service (Netlify, Vercel, GitHub Pages, et cetera).

## Architecture

```
lib/server/
├── index.js         # Façade: serve() function
├── index.spec.js    # Unit tests
├── mime-types.js    # MIME type mappings
├── mime-types.spec.js
└── README.md        # This file
```

The `server` module uses a **façade pattern** to hide implementation details. The current implementation uses Node.js built-in `node:http`, but can easily be replaced with another library, such as `serve-handler`, without changing the public API.

## API

### `serve(rootDir, options) => Promise<{ url, stop }>`

Starts a static file server.

**Parameters:**
- `rootDir` (string): Directory to serve files from
- `options.port` (number, default: 8080): Port to listen on
- `options.quiet` (boolean, default: false): Suppress console output

**Returns:**
- `url` (string): Server URL (e.g., `http://localhost:8080`)
- `stop` (function): Async function to stop the server

### MIME Type Utilities

```javascript
import { getMimeType, MIME_TYPES, DEFAULT_MIME_TYPE } from '#lib/server/index.js'

getMimeType('/path/to/file.html')  // 'text/html'
getMimeType('/path/to/unknown')    // 'application/octet-stream'
```

## Security

The server includes basic protection against directory traversal attacks by verifying that resolved file paths remain within the root directory.

## Related

- [ADR: Static File Server](../../docs/architecture-decisions/static-file-server.md) - Decision record for this implementation
- [Workflows: Serving the Built Site](../../docs/workflows.md#serving-the-built-site) - User documentation
