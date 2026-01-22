/**
 * Terminal pager utility
 *
 * Provides paged output for long content in interactive terminals.
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
 *
 * @param {string} content - Content to output
 * @returns {Promise<void>}
 */
export async function outputWithPaging(content) {
  const lines = content.split('\n').length
  const isTTY = process.stdout.isTTY
  const terminalRows = process.stdout.rows || 24

  // Use pager if content exceeds terminal height and we're in a TTY
  if (isTTY && lines > terminalRows) {
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
