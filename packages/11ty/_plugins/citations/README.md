# Quire Citations Plugin
The Quire citations plugin uses [`simple-cite`](https://github.com/lewisacidic/simple-cite#readme) and citation-styles [CSL-JSON](https://github.com/citation-style-language/schema#csl-json-schema) to generate citations with configurable locale and style. It registers an eleventy javascript function `formatCitation`, which is used to create page and publication citations from the [`citation` component](https://github.com/thegetty/quire/packages/11ty/_includes/components/citation/).

## Styles
The default styles included with Quire are MLA and Chicago fullnote bibliography.

### Change the style
See the [`citation-styles` packages](https://github.com/lewisacidic/citation-styles/tree/master/packages) for a list of published styles.

To add a new style, first install the package. 
```sh
npm install style-apa
```

Then set the style in `citationsPlugin.options`:
```javascript
// .eleventy.js

eleventyConfig.addPlugin(citationsPlugin, { 
  styles: {
    apa: require('style-apa')
  }
})
```

To use, set the `citation` shortcode `type` to the style name.
```javascript
citation({ context: 'publication', type: 'apa' })
```

## Locales
The default locale is `locale-en-us`. 

### Set the locale
See [citation-style-language](https://github.com/citation-style-language/locales) for a list of locales.

To add a new locale, install it:
```sh
npm install locale-fr-fr
```

Then set the locale in `citationsPlugin.options`:
```javascript
// .eleventy.js

eleventyConfig.addPlugin(citationsPlugin, { locale: 'locale-fr-fr' })
```
