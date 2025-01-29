import { createTag, stripIndents } from 'common-tags'

const renderOneLine = createTag({
  onString (string) {
    return stripIndents(string)
  },
  onEndResult (string) {
    return string.replace(/\n/g, '')
  }
})

export * from 'common-tags'
export { renderOneLine }
