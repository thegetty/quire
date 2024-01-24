import commonTags from 'common-tags'
const { createTag, stripIndents } = commonTags

export default {
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
