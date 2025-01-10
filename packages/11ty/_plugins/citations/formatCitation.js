import chalkFactory from '#lib/chalk/index.js'
// import Processor from 'simple-cite'
import chicago from './styles/chicago-fullnote-bibliography.js'
import mla from './styles/mla.js'

const logger = chalkFactory('plugins:citations')

const defaultStyles = {
  chicago,
  mla
}

export default async function(options={}) {
  const locale = await import(options.locale || 'locale-en-us')
  const styles = Object.assign(defaultStyles, options.styles)

  return function(item, { type }) {
    const style = styles[type]

    if (!style) {
      logger.error(`Citation style "${type}" is not supported. You may need to add it to _plugins/citations/styles.`)
      return
    }

    // const processor = new Processor({ items: [item], locale, style })
    // const citation = processor.cite({ citationItems: [{ id: item.id }] })
    const citation = ''
    const bibliography = '' //processor.bibliography()

    return type === 'mla'
      ? `${citation.replace(/\s+$/, '')} <span class="cite-current-date__statement">Accessed <span class="cite-current-date">DD Mon. YYYY</span>.</span>`
      : citation
  }
}
