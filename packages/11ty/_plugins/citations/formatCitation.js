const Processor = require('simple-cite')

const defaultStyles = {
  chicago: require('./styles/chicago-fullnote-bibliography'),
  mla: require('style-mla')
}

module.exports = function(options={}) {
  const locale = require(options.locale || 'locale-en-us')
  const styles = Object.assign(defaultStyles, options.styles)

  return function(item, params) {
    const { type } = params

    const style = styles[type]

    if (!style) {
      console.error(`Citation style "${type}" is not supported. You may need to add it to _plugins/citations/styles.`)
      return;
    }

    const processor = new Processor({
      items: [item],
      locale,
      style
    })
    const citation = processor.cite({ citationItems: [{ id: item.id }] })
    return processor.bibliography().value
  }
}
