import Command from '#src/Command.js'
import { withOutputModes } from '#lib/commander/index.js'
import paths, { hasSiteOutput } from '#lib/project/index.js'
import eleventy from '#lib/11ty/index.js'
import { serve } from '#lib/server/index.js'
import processManager from '#lib/process/manager.js'
import reporter from '#lib/reporter/index.js'
import open from 'open'
import testcwd from '#helpers/test-cwd.js'
import { MissingBuildOutputError } from '#src/errors/index.js'

/**
 * Quire CLI `serve` Command
 *
 * Starts a lightweight static file server for the built site output.
 * Unlike `preview`, this does not run Eleventy's dev server with live-reload.
 *
 * @class      ServeCommand
 * @extends    {Command}
 */
export default class ServeCommand extends Command {
  static definition = withOutputModes({
    name: 'serve',
    description: 'Start a static file server for the built site output',
    summary: 'serve built site locally',
    docsLink: 'quire-commands/#serve',
    helpText: `
Examples:
  quire serve                   Serve _site/ on port 8080
  quire serve --port 3000       Use custom port
  quire serve --build --open    Build if needed, then open browser
`,
    version: '1.0.0',
    options: [
      ['-p, --port <port>', 'server port', 8080],
      ['--build', 'run build first if output is missing'],
      ['--open', 'open in default browser'],
    ],
  })

  constructor() {
    super(ServeCommand.definition)
  }

  async action(options, command) {
    this.debug('called with options %O', options)

    // Configure reporter for this command
    reporter.configure({ quiet: options.quiet, verbose: options.verbose })

    const port = parseInt(options.port, 10)
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid port: ${options.port}`)
    }

    // Run build first if --build flag is set and output is missing
    if (options.build && !hasSiteOutput()) {
      this.debug('running build before serving')
      reporter.start('Building site...', { showElapsed: true })
      try {
        await eleventy.build({ debug: options.debug })
        reporter.succeed('Build complete')
      } catch (error) {
        reporter.fail('Build failed')
        throw error
      }
    }

    // Check for build output
    if (!hasSiteOutput()) {
      throw new MissingBuildOutputError('serve', paths.getSitePath())
    }

    // Start static file server (façade returns { url, stop })
    // Nota bene: Server status messages use logger (not reporter) because
    // the server runs indefinitely - a spinner would never complete.
    const { url, stop } =
      await serve(paths.getSitePath(), { port, quiet: options.quiet, verbose: options.verbose })

    // Register cleanup handler for graceful shutdown
    processManager.onShutdown('serve', stop)

    try {
      if (options.open) open(url);
      // Keep the process running until shutdown signal
      await new Promise(() => {})
    } finally {
      processManager.onShutdownComplete('serve')
    }
  }

  preAction(thisCommand, actionCommand) {
    testcwd(thisCommand)
  }
}
