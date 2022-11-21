/**
 * A façade module for EPUB libraries
 */
export default {
  build: async (input, output, lib='epubjs', options={}) => {
    let epublib

    switch (lib.toLowerCase()) {
      case 'epubjs': {
        epublib = await import('./epubjs')
        break
      }
      default:
        console.error('[CLI:lib/epub] No EPUB library specified')
        return
    }

    console.info(`[CLI:lib/epub] generating EPUB using ${lib}`)
    return await epublib(input, options)
  }
}
