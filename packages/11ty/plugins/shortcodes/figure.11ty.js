/**
 * { function_description }
 * Get attributes defined directly on shortcode
 * Get attributes from figures.yml
 *
 * @param      {string}   alt,
 * @param      {string}   aspectRatio,
 * @param      {string}   caption,
 * @param      {string}   credit,
 * @param      {string}   download
 * @param      {string}   id,
 * @param      {string}   label,
 * @param      {string}   mediaId,
 * @param      {string}   mediaType,
 * @param      {string}   src
 *
 * @return     {boolean}  { description_of_the_return_value }
 */
module.exports = function(eleventyConfig, data) {
  const slugify = eleventyConfig.getFilter('slugify')

  let classes,
      partial;

  switch (data.mediaType) {
    case 'soundcloud':
      partial = 'figures/media-types/soundcloud.html';
      break;
    case 'table':
      partial = 'figures/media-types/table.html';
      break;
    case 'vimeo':
      partial = 'figures/media-types/vimeo.html';
      break;
    case 'website':
      partial = 'figures/media-types/website.html';
      break;
    case 'youtube':
      partial = 'figures/media-types/youtube.html';
      break;
    default:
      parial = 'figures/media-types/image.html';
  }

  return `
    <figure id="${slugify(id)}" data="q-figure" class="${classes}">
      <div class="q-figure__wrapper">${partial}</div>
    </figure>
  `
}
