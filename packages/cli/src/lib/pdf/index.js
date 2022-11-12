import { execa } from 'execa'
import which from 'which'

/**
 * Test if a shell command exists in the current shell PATH
 *
 * @param  {String}  command  The command name to test
 */
const commandExists = (command) => {
  if (!which.sync(command, { nothrow: true })) {
    console.error(`Unable to locate command '${command}'\n
      Ensure that the '${command}' command is installed and available in the shell environment PATH.
    `)
  }
}

/**
 * A wrapper module for PDF generation tools
 *
 */
export default {
  build(input, output, lib='pagedjs', options={}) {
    switch (lib) {
      case 'paged' || 'pagedjs' :
        if (!commandExists('pagedjs-cli')) return
        const opts = [
          `--outline-tags 'h1'`,
          `--output ${output}`,
        ]
        console.info(`[CLI:lib/pdf] generating PDF using ${lib}`)
        const { stderror, stdout } = execa('pagedjs-cli', [...opts, input])
      case 'prince' :
        if (!commandExists('prince')) return
        const opts = [
          `--outline-tags 'h1'`,
          `--output ${output}`,
        ]
        console.info(`[CLI:lib/pdf] generating PDF using ${lib}`)
        const { stderror, stdout } = execa('prince', [...opts, input])
      default:
        console.error('[CLI:lib/pdf] No PDF library specified')
    }
  }
}
