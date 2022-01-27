/**
 *   Adds info to use in PrinceXML running page footers
 *   @todo if there are sections, set section title to title if slug == '.'
 */

module.exports = function(data) {
  const { config, label } = data

  if (!config.params.pdf) return ''

  const pageTitle = [label, config.pageLabelDivider, short_title || title].join('') // markdownify | truncate 35 
  return `
    <div style="display: none">
      <span class="pdf-page-title">${ pageTitle }</span>
      <span class="pdf-page-section">
        ${ sectionTitle || section }
      </span>
    </div>
  `
}