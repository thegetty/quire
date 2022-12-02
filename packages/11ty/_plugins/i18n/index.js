const { EleventyI18nPlugin } = require('@11ty/eleventy')

/**
 * Eleventy Internationalization Plugin
 *
 * This plugin helps to manage links between content but does not localize content.
 * @see https://www.11ty.dev/docs/plugins/i18n/
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  options         options
 */
module.exports = function(eleventyConfig, options) {
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    /**
     * Default locale code; any valid BCP 47-compatible language tag is supported
     */
    defaultLanguage: 'en',
    /**
     * Configure when errors are thrown for missing localized content files
     * @values [ allow-fallback | strict | never ]
     */
    errorMode: 'strict',
    /**
     * Universal template filters added by the Eleventy i18n plugin
     */
    filters: {
      /**
       * Returns an array of the alternative content for a specified URL
       * @see https://www.11ty.dev/docs/plugins/i18n/#locale_links-filter
       */
      links: 'locale_links',
      /**
       * Transforms an arbitrary URL string with the current page locale code
       * @see https://www.11ty.dev/docs/plugins/i18n/#locale_url-filter
       */
      url: 'locale_url'
    }
  })
}
