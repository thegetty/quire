const { createTag, stripIndents } = require('common-tags')

module.exports = createTag({
  onString(string) {
    return stripIndents(string)
  },
  onEndResult(string) {
    return string.replace(/\n/g, '')
  }
});
