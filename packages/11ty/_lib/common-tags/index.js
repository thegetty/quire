const commonTags = require('common-tags')
const { createTag, stripIndents } = commonTags

module.exports = {
  ...commonTags,
  renderOneLine: createTag({
    onString(string) {
      return stripIndents(string)
    },
    onEndResult(string) {
      return string.replace(/\n/g, '')
    }
  })
}
