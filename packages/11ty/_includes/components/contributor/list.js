/**
 * @param  {Object} context
 * @param  {Array} contributors
 * @param  {String} contributorType - "primary", "secondary" or "all"
 * @param  {String} listType - "string", "list", or "list-plus"
 * 
 * @return {String}                 Markup for contributors
 */
module.exports = function (eleventyConfig, globalData) {
  const { config, contributors, contributorType, listType } = data
  const contributorTitle = eleventyConfig.getFilter('contributorTitle')
  const fullName = eleventyConfig.getFilter('fullName')
  const getContributor = eleventyConfig.getFilter('getContributor')

  let contributorList = contributors.map((item) => item.id ? getContributor(item.id) : item)
  contributorList = (contributorType === 'all') 
    ? contributorList 
    : contributorList.filter((item) => item.type === contributorType)

  if (!contributorList.length) return ''

  const contributorNames = contributorList.map(fullName)
  let contributorElement
  let listItems
  switch(listType) {
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
