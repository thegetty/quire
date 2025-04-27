import chalkFactory from '#lib/chalk/index.js'
import { Cite, plugins } from '@citation-js/core'
import '@citation-js/plugin-csl'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const logger = chalkFactory('plugins:citations')

// Stub `import.meta.dirname` for users on node < v20 that don't have it
const importMetaDirname = path.dirname(url.fileURLToPath(import.meta.url))

const defaultStyles = {
  chicago: path.join(importMetaDirname, 'styles/chicago-fullnote-bibliography.csl'),
  mla: path.join(importMetaDirname, 'styles/modern-language-association.csl')
}

export default async function (options = {}) {
  const styles = Object.assign(defaultStyles, options.styles)
  const locale = options.locale || 'en-US'

  // Load CSL stylesheets see: https://github.com/citation-js/citation-js/tree/main/packages/plugin-csl
  const cslConfig = plugins.config.get('@csl')

  Object.entries(styles).forEach(([styleKey, stylePath]) => {
    if (!fs.existsSync(stylePath)) return

    const data = fs.readFileSync(stylePath, 'utf8')
    cslConfig.templates.add(styleKey, data)
  })

  return function (item, { type }) {
    const style = styles[type]

    if (!style) {
      logger.error(`Citation style "${type}" is not supported. You may need to add it to _plugins/citations/styles.`)
      return
    }

    const citation = new Cite({ ...item }).format('bibliography', { format: 'text', template: type, lang: locale })

    return type === 'mla'
      ? `${citation.replace(/\s+$/, '')} <span class="cite-current-date__statement">Accessed <span class="cite-current-date">DD Mon. YYYY</span>.</span>`
      : citation
  }
}
