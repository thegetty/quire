module.exports = function(eleventyConfig) {
  const projectDir = 'src'

  return {
    dir: {
      input: projectDir,
      output: 'site',
      // ⚠️ the following values are _relative_ to the `input` directory
      data: '_data',
      includes: '_includes',
      layouts:  '_layouts'
    },
    /**
     * All of the following template formats support universal shortcodes.
     *
     * Nota bene:
     * Markdown files are pre-processed as Liquid templates by default. This
     * means that shortcodes available in Liquid templates are also available
     * in Markdown files. Likewise, if you change the template engine for
     * Markdown files, the shortcodes available for that templating language
     * will also be available in Markdown files.
     */
    templateFormats: [
      '11ty.js', // JavaScript
      'hbs',     // Handlebars
      'liquid',  // Liquid
      'md',      // Markdown
      'njk',     // Nunjucks
      'html'
    ]
  }
}
