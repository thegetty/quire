const { createTag } = require('common-tags')
const { JSDOM } = require('jsdom')

module.exports = createTag({
  onString(string) {
    const dom = new JSDOM(string)
    return dom.window.document.body.textContent
  }
});
