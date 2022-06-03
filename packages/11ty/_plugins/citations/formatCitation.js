const Processor = require('simple-cite')
const locale = require('locale-en-us')
const styles = require('./styles')

module.exports = function(item, params) {
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
