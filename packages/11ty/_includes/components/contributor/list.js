/**
 * @param  {Object} context
 * @param  {Array}  contributors
 * @param  {String} type - "all" (default), "primary", or "secondary"
 * @param  {String} format - "string" (default), "name", or "name-title"
 * 
 * @return {String}                 Markup for contributors
 */
module.exports = function (eleventyConfig) {
  const contributorTitle = eleventyConfig.getFilter('contributorTitle')
  const fullname = eleventyConfig.getFilter('fullname')
  const getContributor = eleventyConfig.getFilter('getContributor')

  return function (params) {
    const { contributor: contributors, type = 'all', format = 'string' } = params

    if (!Array.isArray(contributors)) return ''

    let contributorList = contributors.map((item) => item.id ? getContributor(item.id) : item)
    contributorList = (type === 'all')
      ? contributorList
      : contributorList.filter((item) => item.type === type)

    if (!contributorList.length) return ''

    const contributorNames = contributorList.map(fullname).filter((name) => name)
    let contributorElement
    let listItems

    switch(format) {
      case 'string':
        const last = contributorNames.pop();
        const namesString = contributorNames.length > 1 ? contributorNames.join(', ') + ' and ' + last : last
        contributorElement = `<span class="quire-contributor">${namesString}</span>`
        break;
      case 'name':
        listItems = contributorNames.map((name) => `<li>${name}</li>`)
        contributorElement = `<ul>${listItems.join('')}</ul>`
        break;
      case 'name-title':
        listItems = contributorList
          .map((contributor) => {
            return `<li class="quire-contributor">${[fullname(contributor), contributorTitle(contributor)].join(', ')}</li>`
          })
        contributorElement = `<ul>${listItems.join('')}</ul>`
        break;
      default:
        contributorElement = ''
        break;
    }

    return contributorElement
  }
}
