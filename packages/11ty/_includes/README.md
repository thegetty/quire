## Eleventy `_includes`

> Eleventy `_includes`, like `_layouts` are language-agnostic, are not processed as full template files, and are meant to wrap and/or be wrapped by other templates. Unlike `_layouts`, `_includes` are meant to be consumed _inline_ by other templates such as `_layouts` or other `_includes`.

### Data
All `_includes` have access to two parameters, `eleventyConfig` and `globalData`, which will be followed by any `args` passed to the template when it's being included.

#### eleventyConfig
The `eleventyConfig` object

#### globalData
Data from the yaml files in `content/_data`

### Example Usage

#### In an `11ty.js` `_include`
```
module.exports = function(eleventyConfig, globalData, page) {
  const siteTitle = eleventyConfig.getFilter('siteTitle')

  return `
    <header class="quire-menu__header">
      <h4 class="quire-menu__header__title">
        ${siteTitle()}
      </h4>
    </header>
  `
}
```

#### In an `11ty.js` `_layout`
```
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
