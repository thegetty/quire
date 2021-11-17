const { html } = require('common-tags')

module.exports = class ContributorsLayout {
  data() {
    return {
      layout: 'page'
    }
  }

  render(data) {
    const { contributorType, format, pages, publication } = data
    /**
     * Filter contributors by type
     */
    let contributors = contributorType === 'all' 
      ? publication.contributor 
      : publication.contributor.filter((item) => item.type === contributorType)

    /**
     * Add links to contributor pages to each contributor
     */
      contributors = contributors.map((contributor) => {
        contributor.pages = pages.filter(
          ({ data }) => 
            data.contributor && data.contributor.find(
              (pageContributor) => pageContributor.id === contributor.id)
        )
        return contributor
      })
    /**
     * Render qcontributor for each contributor
     */
    const contributorElements = contributors.map((item) => this.qcontributor(item, format))

    return contributorElements.join('')
  }
}
