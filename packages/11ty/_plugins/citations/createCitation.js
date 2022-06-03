const Processor = require('simple-cite')
const locale = require('locale-en-us')
const styles = require('./styles')

module.exports = function(component, params) {
  const { type } = params
  const item = component(params)
  const processor = new Processor({
    items: [item],
    locale,
    style: styles[type]
  })
  const citation = processor.cite({ citationItems: [{ id: item.id }] })
  return processor.bibliography().value
}
