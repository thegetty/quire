## Node module aliases

Quire uses `module-alias` to handle `import`/`require` aliases. 

`module-alias` is registered in `.eleventy.js`:

``` javascript
require('module-alias/register')
```

It is configured under the `_moduleAliases` key in `package.json`:

``` json
{
  // omitted for example
  "_moduleAliases": {
    "~includes": "./_includes",
    "~layouts": "./layouts",
    "~lib": "./_lib",
    "~plugins": "./_plugins"
  }
}
```

Modules are imported like this:

``` javascript
const { renderOneLine, stripIndent } = require('~lib/common-tags')
```

### Alternative implementation: import mapping

See https://github.com/ilearnio/module-alias/issues/113

To get the same results with no external dependency, we can use subpath imports, configured in the `imports` key of `package.json`

``` json
{
  // omitted for example
  "imports": {
    "#lib/*": "./_lib/*",
    "#plugins/*": "./_plugins/*"
  }
}
```

For a discussion of this approach see ilearnio/module-alias#113, several caveats of using subpath `imports` are:
- non-standard `#` prefix
- module filenames have to be included explicitly

``` javascript
const { renderOneLine, stripIndent } = require('#lib/common-tags/index.js')
```
