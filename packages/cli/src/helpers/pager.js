/**
 * Terminal pager utility
 *
 * Provides paged output for long content in interactive terminals.
 * Paging can be disabled with:
 * - `--no-pager` CLI flag (sets NO_PAGER env var)
 * - `NO_PAGER=1` environment variable
 * - `PAGER=cat` traditional Unix convention (content passes through without paging)
 *
 * @module helpers/pager
 */
import { spawn } from 'node:child_process'

/**
 * Output content with optional paging for long content
 *
 * Uses system pager (less/more) when:
 * - Output is to an interactive terminal (TTY)
 * - Content exceeds terminal height
 * - Paging is not disabled via NO_PAGER env var
 *
 * The PAGER env var selects the pager program (default: less on Unix, more on
 * Windows). Setting PAGER=cat effectively disables paging as a traditional
 * Unix convention.
 *
 * @param {string} content - Content to output
 * @returns {Promise<void>}
 */
export async function outputWithPaging(content) {
  const noPager = process.env.NO_PAGER
  const lines = content.split('\n').length
  const isTTY = process.stdout.isTTY
  const terminalRows = process.stdout.rows || 24

  // Use pager if content exceeds terminal height and we're in a TTY
  if (!noPager && isTTY && lines > terminalRows) {
    const pager = process.env.PAGER || (process.platform === 'win32' ? 'more' : 'less')
    const pagerArgs = pager === 'less' ? ['-R'] : [] // -R preserves ANSI colors

    return new Promise((resolve) => {
      const child = spawn(pager, pagerArgs, {
        stdio: ['pipe', 'inherit', 'inherit']
      })

      child.stdin.write(content + '\n')
      child.stdin.end()

      child.on('close', resolve)
      child.on('error', () => {
        // Fallback to direct output if pager fails
        process.stdout.write(content + '\n')
        resolve()
      })
    })
  }

  // Direct output for non-TTY or short content
  process.stdout.write(content + '\n')
}
