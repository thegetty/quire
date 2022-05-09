/**
 * Add custom collections
 * @param  {Object} eleventyConfig
 * @param  {Object} options
 */
module.exports = function (eleventyConfig, options = {}) {
  /**
   * Collection of pages to display in the menu
   */
  eleventyConfig.addCollection('menu', function (collectionApi) {
    return collectionApi.getAll().filter(function ({ data }) {
      return data.menu !== false && data.type !== 'data';
    });
  });
  /**
   * Collection of pages to display in Table of Contents
   */
  eleventyConfig.addCollection('tableOfContents', function (collectionApi) {
    return collectionApi.getAll().filter(function ({ data }) {
      return data.toc !== false && data.type !== 'data';
    });
  });
};
