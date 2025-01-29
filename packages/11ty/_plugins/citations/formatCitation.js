import chalkFactory from '#lib/chalk/index.js'
import citeproc from 'citeproc'
import chicago from './styles/chicago-fullnote-bibliography.js'
import mla from './styles/mla.js'

const logger = chalkFactory('plugins:citations')

const defaultStyles = {
  chicago,
  mla
}

export default async function (options = {}) {
  const { default: locale } = await import(options.locale || 'locale-en-us')
  const styles = Object.assign(defaultStyles, options.styles)

  return function (item, { type }) {
    const style = styles[type]

    if (!style) {
      logger.error(`Citation style "${type}" is not supported. You may need to add it to _plugins/citations/styles.`)
      return
    }

    const sys = {
      retrieveItem: () => { return { ...item, properties: { noteIndex: 0 } } },
      retrieveLocale: () => locale
    }

    const engine = new citeproc.Engine(sys, style)
    engine.opt.development_extensions.wrap_url_and_doi = true
    engine.setOutputFormat('text')

    const citationData = { citationItems: [{ id: item.id }] }

    const result = engine.processCitationCluster(citationData, [], [])
    const citation = engine.previewCitationCluster(citationData, [], [], 'text')

    return type === 'mla'
      ? `${citation.replace(/\s+$/, '')} <span class="cite-current-date__statement">Accessed <span class="cite-current-date">DD Mon. YYYY</span>.</span>`
      : citation
  }
}
