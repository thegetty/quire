import { execa } from 'execa'

/**
 * A wrapper module for PDF generation tools
 *
 */
export default {
  build(input, output, lib='pagedjs', options={}) {
    switch (lib) {
      case 'paged' || 'pagedjs' :
        const opts = [
          `--outline-tags 'h1'`,
          `--output ${output}`,
        ]
        const { stderror, stdout } = execa('pagedjs-cli', [...opts, input])
      case 'prince' :
        const opts = [
          `--outline-tags 'h1'`,
          `--output ${output}`,
        ]
        const { stderror, stdout } = execa('prince', [...opts, input])
      default:
        console.error('[CLI:lib/pdf] No PDF library specified')
    }
  }
}
