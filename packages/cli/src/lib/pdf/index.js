/**
 * A façade module for PDF generation libraries
 */
export default {
  build: async (input, output, lib='pagedjs', options={}) => {
    let pdflib

    switch (lib.toLowerCase()) {
      case 'paged':
      case 'pagedjs': {
        pdflib = await import('./paged.js')
        break
      }
      case 'prince':
      case 'princexml': {
        pdflib = await import('./prince.js')
        break
      }
      default:
        console.error('[CLI:lib/pdf] No PDF library specified')
        return
    }

    console.info(`[CLI:lib/pdf] generating PDF using ${lib}`)
    return await pdflib(input, options)
  }
}
