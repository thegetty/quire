/**
 * Project computed data
 */
module.exports = {
  publicationAuthors: ({ publication }) => {
    return publication.contributor.map((item) => item.type === "primary");
  },
  publicationAuthorCount: ({ publication }) => {
    return publication.contributor.map((item) => item.type === "primary").length;
  },
  publicationEditors: ({ publication }) => {
    return publication.contributor.map((item) => item.role === "editor");
  },
  publicationEditorCount: ({ publication }) => {
    return publication.contributor.map((item) => item.role === "editor").length;
  },
  citations: ({ publication }) => {
    const contributorCount = publication.contributor.length

    const editorTag(string, count) {
      switch (count) {
        case (count > 1):
          return `${string}s`
        case (count === 1):
          return string
        default:
          break;
      }
    }

    const config = {
      chicago: {
        displayLength: 7,
        editorTag: editorTag('ed', contributorCount),
        maxLength: 10
      },
      mla: {
        displayLength: 1,
        editorTag: editorTag: editorTag('editor', contributorCount),
        maxLength: 2
      }
    }
    return config;
  }
}
