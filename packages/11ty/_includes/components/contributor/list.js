/**
 * @param  {Object} context
 * @param  {Array}  contributors
 * @param  {String} type - "all" (default), "primary", or "secondary"
 * @param  {String} format - "string" (default), "list", or "list-plus"
 * 
 * @return {String}                 Markup for contributors
 */
module.exports = function (eleventyConfig, globalData) {
  const contributorTitle = eleventyConfig.getFilter('contributorTitle')
  const fullname = eleventyConfig.getFilter('fullname')
  const getContributor = eleventyConfig.getFilter('getContributor')

  return function (params) {
    const { contributors, type = 'all', format = 'string' } = params

    let contributorList = contributors.map((item) => item.id ? getContributor(item.id) : item)
    contributorList = (type === 'all')
      ? contributorList
      : contributorList.filter((item) => item.type === type)

    if (!contributorList.length) return ''

    const contributorNames = contributorList.map(fullname)
    let contributorElement
    let listItems

    switch(format) {
      case 'string':
        const last = contributorNames.pop();
        const namesString = contributorNames.length > 1 ? contributorNames.join(', ') + ' and ' + last : last
        contributorElement = `<span class="quire-contributor">${namesString}</span>`
        break;
      case 'list':
        listItems = contributorNames.map((name) => `<li>${name}</li>`)
        contributorElement = `<ul>${listItems.join('')}</ul>`
        break;
      case 'list-plus':
        const title = contributorTitle(contributor)
        listItems = contributorNames
          .map((name) => `<li class="quire-contributor">${[name, title].join(', ')}</li>`)

        contributorELement = `<ul>${listItems.join('')}/ul>`
        break;
      default:
        contributorElement = ''
        break;
    }

    return contributorElement
  }
}
