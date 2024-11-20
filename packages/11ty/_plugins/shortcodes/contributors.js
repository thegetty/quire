const chalkFactory = require('~lib/chalk')
const { html } = require('~lib/common-tags')

const logger = chalkFactory('shortcodes:contributors')

/**
 * Contributor shortcode
 * Renders a list of contributors
 *
 * @param  {Array|String} context Array of contributor objects OR string override
 * @param  {String} align How to align the text (name-title-block and bio only) Values: 'left' (default), 'center', 'right'
 * @param  {String} type The contributor type to render. Values: 'all' (default), 'primary', 'secondary'
 * @param  {String} format How to display the contributors. Values: 'string', 'bio', 'name', 'name-title', 'name-title-block'. Default set in config.bylineFormat
 *
 * @return {String} Markup for contributors
 */
module.exports = function (eleventyConfig) {
  const contributorBio = eleventyConfig.getFilter('contributorBio')
  const fullname = eleventyConfig.getFilter('fullname')
  const getContributor = eleventyConfig.getFilter('getContributor')
  const initials = eleventyConfig.getFilter('initials')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')
  const sortContributors = eleventyConfig.getFilter('sortContributors')

  const { bylineFormat } = eleventyConfig.globalData.config

  return function (params) {
    const {
      align='left',
      context: contributors,
      format=bylineFormat,
      role,
      type='all'
    } = params

    const formats = ['bio', 'initials', 'name', 'name-title', 'name-title-block', 'string']

    if (format && !formats.includes(format)) {
      logger.error(
        `Unrecognized contributors shortcode format "${format}". Supported format values are: ${formats.join(', ')}`
      )
      return ''
    }

    if (!contributors) return ''

    if (typeof contributors === 'string') return markdownify(contributors)

    let contributorList = contributors
      .flatMap(getContributor)
      .filter((item) => (type || role) && type !== 'all'
        ? (type && item.type === type) || (role && item.role === role)
        : item
      )
    contributorList = sortContributors(contributorList)

    const contributorNames = contributorList
      .map(fullname)
      .filter((name) => name)
    if (!contributorList.length) return ''

    let contributorsElement

    switch (format) {
      case 'bio':
        contributorsElement = `
          <ul class='quire-contributors-list ${format} align-${align}'>
            ${contributorList.map((contributor) => contributorBio(contributor)).join('')}
          </ul>
        `
        break
      case 'initials': {
        const contributorInitials = contributorList.map(initials)
        const last = contributorInitials.pop()
        const nameString =
          contributorInitials.length >= 1
            ? contributorInitials.join(', ') + ', and ' + last
            : last
        contributorsElement = `<span class="quire-contributor">${nameString}</span>`
        break
      }
      case 'name':
      case 'name-title':
      case 'name-title-block': {
        const separator = (format === 'name-title') ? ', ' : ''
        const listItems = contributorList.map((contributor) => {
          const contributorParts = [
            `<span class="quire-contributor__name">${fullname(contributor)}</span>`
          ]
          contributor.title && format !== 'name'
            ? contributorParts.push(
              `<span class="quire-contributor__title">${ contributor.title }</span>`
            )
            : null
          contributor.affiliation && format !== 'name'
            ? contributorParts.push(
              `<span class="quire-contributor__affiliation">${ contributor.affiliation }</span>`
            )
            : null
          return `
            <li class="quire-contributor" id="${slugify(contributor.id)}">${contributorParts.join(separator)}</li>
          `
        })
        contributorsElement = `
          <ul class="quire-contributors-list ${format} align-${align}">
            ${listItems.join('')}
          </ul>
        `
        break
      }
      case 'string': {
        const last = contributorNames.pop()
        const namesString =
          contributorNames.length >= 1
            ? contributorNames.join(', ') + ', and ' + last
            : last
        contributorsElement = `<span class='quire-contributor'>${namesString}</span>`
        break
      }
      default:
        contributorsElement = ''
        break
    }

    return html`${contributorsElement}`
  }
}
