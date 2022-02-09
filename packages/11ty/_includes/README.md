## Eleventy `_includes`

> Eleventy `_includes`, like `_layouts` are language-agnostic, are not processed as full template files, and are meant to wrap and/or be wrapped by other templates. Unlike `_layouts`, `_includes` are meant to be consumed _inline_ by other templates such as `_layouts` or other `_includes`.

Use Liquid or Nunjucks template language includes for HTML _partials_ that do not need parameters other than those available in the global data inheritance context.

### `_includes/components`

The `_include/components` implement _cross templating language_ includes, also refered to as "shortcode components" because they are registered as Eleventy shortcodes (see the [`components` plugin module](`master/plugins/components/README.md`)) that can be used in multiple template languages.

Use a shortcode components when the rendering the include requires using JavaScript or NPM packages, complex conditional logic or manipulation of data, including async data.


### Data
All `_includes` have access to two parameters, `eleventyConfig` and `globalData`, which will be followed by any `args` passed to the template when it's being included.

#### eleventyConfig
The `eleventyConfig` object

#### globalData
Data from the yaml files in `content/_data`

### Example Usage

#### In an `11ty.js` `_include`
```javascript
const { html } = require('common-tags')

module.exports = function(eleventyConfig, globalData, page) {
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  return html`
    <header class="quire-menu__header">
      <h4 class="quire-menu__header__title">
        ${siteTitle()}
      </h4>
    </header>
  `
}
```

#### In an `11ty.js` `_layout`
```javascript
const { html } = require('common-tags')

exports.data = {
  layout: 'base'
}

exports.render = function(data) {
  const { content, pagination } = data

  return html`
    <div class="lorem-ipsum">
      ${content}

      ${this.pageButtons(pagination)}

    </div>
  `
}
```
