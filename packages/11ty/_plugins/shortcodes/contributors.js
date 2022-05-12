const { html } = require('common-tags');
/**
 * Contributor shortcode
 * Renders a list of contributors
 * 
 * @param  {Array|String}  contributors Array of contributor objects OR string override
 * @param  {String} align How to align the text (name-title-block and bio only) Values: 'left' (default), 'center', 'right'
 * @param  {String} type The contributor type to render. Values: 'all' (default), 'primary', 'secondary'
 * @param  {String} format How to display the contributors. Values: 'string', 'bio', 'name', 'name-title', 'name-title-block'. Default set in config.params.contributorByline
 *
 * @return {String} Markup for contributors
 */
module.exports = function (eleventyConfig) {
  const contributorBio = eleventyConfig.getFilter('contributorBio');
  const fullname = eleventyConfig.getFilter('fullname');
  const getContributor = eleventyConfig.getFilter('getContributor');
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { contributorByline: defaultFormat } = eleventyConfig.globalData.config.params

  return function (params) {
    const { align='left', contributors, type = 'all', format = defaultFormat } = params;

    if (!contributors) return ''

    if (typeof contributors === 'string') return markdownify(contributors)

    const contributorList = contributors
      .flatMap((item) => !item.id
        ? [] 
        : getContributor(item))
      .filter((item) => type !== 'all'
        ? item.type === type
        : item
      )

    const contributorNames = contributorList
      .map(fullname)
      .filter((name) => name);

    if (!contributorList.length) return '';

    let contributorsElement;

    switch (format) {
      case 'bio':
        contributorsElement = `
          <ul class='quire-contributors-list ${format} align-${align}'>
            ${contributorList.map((contributor) => contributorBio(contributor)).join('')}
          </ul>
        `
        break;
      case 'name':
        contributorsElement = `
          <ul>
            ${contributorNames.map((name) => `<li>${name}</li>`).join('')}
          </ul>
        `
        break;
      case 'name-title':
      case 'name-title-block':
        const join = (format === 'name-title') ? ', ' : ''
        const listItems = contributorList.map((contributor) => {
          const title = contributor.title 
            ? `<span class="quire-contributor__title">${ contributor.title }</span>`
            : ''
          const affiliation = contributor.affiliation 
            ? `<span class="quire-contributor__affiliation">${ contributor.affiliation }</span>`
            : ''
          return `<li class='quire-contributor'>${[
            fullname(contributor),
            title,
            affiliation
          ].join(join)}</li>`;
        });
        contributorsElement = `
          <ul class='quire-contributors-list ${format} align-${align}'>
            ${listItems.join('')}
          </ul>
        `
        break;
      case 'string':
        const last = contributorNames.pop();
        const namesString =
          contributorNames.length > 1
            ? contributorNames.join(', ') + ' and ' + last
            : last;
        contributorsElement = `<span class='quire-contributor'>${namesString}</span>`;
        break;
      default:
        contributorsElement = ''
        break;
    }

    return html`${contributorsElement}`;
  };
};
