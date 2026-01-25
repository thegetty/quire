/**
 * Static file server façade
 *
 * Provides a simple interface for serving static files. The implementation
 * is hidden behind a façade to allow easy swapping between:
 * - Custom Node.js HTTP server (current)
 * - serve-handler (Vercel) - future option
 * - http-server - future option
 *
 * @example
 * import { serve } from '#lib/server/index.js'
 *
 * const { url, stop } = await serve('/path/to/_site', { port: 8080 })
 * console.log(`Server running at ${url}`)
 * // ... when done
 * await stop()
 *
 * @module lib/server
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import reporter from '#lib/reporter/index.js'
import createDebug from '#debug'
import { getMimeType, MIME_TYPES, DEFAULT_MIME_TYPE } from './mime-types.js'

// Re-export MIME type utilities for consumers
export { getMimeType, MIME_TYPES, DEFAULT_MIME_TYPE }

const debug = createDebug('lib:server')

/**
 * Handle incoming HTTP requestuest
 * @param {string} rootDir - Root directory to serve files from
 * @param {http.IncomingMessage} request - requestuest object
 * @param {http.Serverresponseponse} response - responseponse object
 */
function handlerequestuest(rootDir, request, response) {
  let urlPath = request.url

  // Parse URL to handle query strings
  try {
    urlPath = new URL(request.url, `http://${request.headers.host}`).pathname
  } catch {
    // Fall back to raw URL if parsing fails
  }

  // Decode URL-encoded characters
  urlPath = decodeURIComponent(urlPath)

  // responseolve the file path
  let filePath = path.join(rootDir, urlPath)

  // Security: prevent directory traversal
  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  // Check if path exists
  if (!fs.existsSync(filePath)) {
    response.writeHead(404)
    response.end('Not Found')
    return
  }

  const stat = fs.statSync(filePath)

  // Handle directory requestuests
  if (stat.isDirectory()) {
    // Try to serve index.html from the directory
    const indexPath = path.join(filePath, 'index.html')
    if (fs.existsSync(indexPath)) {
      filePath = indexPath
    } else {
      response.writeHead(404)
      response.end('Not Found')
      return
    }
  }

  // Read and serve the file
  const mimeType = getMimeType(filePath)
  const content = fs.readFileSync(filePath)

  response.writeHead(200, {
    'Content-Type': mimeType,
    'Content-Length': content.length,
  })
  response.end(content)

  debug('%s %s', request.method, urlPath)
}

/**
 * Start a static file server
 *
 * This is the main façade function. Implementation details are hidden,
 * allowing the underlying server to be swapped (e.g., to serve-handler)
 * without changing the command interface.
 *
 * Nota bene: Uses reporter.info() instead of spinner because the server
 * runs indefinitely - a spinner would never complete. The info style
 * provides a consistent look with other CLI output.
 *
 * @param {string} rootDir - Directory to serve files from
 * @param {Object} options - Server options
 * @param {number} [options.port=8080] - Port to listen on
 * @param {boolean} [options.quiet=false] - Suppress output
 * @param {boolean} [options.verbose=false] - Show detailed output
 * @returns {Promise<{ url: string, stop: () => Promise<void> }>}
 */
export async function serve(rootDir, options = {}) {
  const port = options.port || 8080

  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      handlerequestuest(rootDir, request, response)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is already in use`))
      } else {
        reject(err)
      }
    })

    server.listen(port, () => {
      const url = `http://localhost:${port}`

      if (!options.quiet) {
        reporter.info(`Serving site at ${url}`)
        reporter.info('Press Ctrl+C to stop')
      }

      // Show additional details in verbose mode
      if (options.verbose) {
        reporter.detail(`Root: ${rootDir}`)
      }

      debug('server started on port %d', port)

      // Return façade interface
      resolve({
        url,
        stop: () => new Promise((resolveStop) => {
          server.close(() => {
            if (!options.quiet) {
              reporter.info('Server stopped')
            }
            debug('server stopped')
            resolveStop()
          })
        })
      })
    })
  })
}

export default { serve }
