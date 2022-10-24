## Node module aliases

Quire uses the `module-alias` package for `import` and `require` aliases. 

The `module-alias` package is registered in `.eleventy.js` and modules aliases are configured under the `_moduleAliases` key in `package.json`.
`.eleventy.js`
``` javascript
require('module-alias/register')
```

`package.json`
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

### Node import mapping

An alternate implementation with no external dependency uses [Node.js subpath imports](https://nodejs.org/api/packages.html#subpath-imports), which are configured under the `imports` key of `package.json`
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

## IIIF Assets

Quire's IIIF processing generates additional files such as image tiles and JSON manifests before building the project. During development, these files are written directly to the eleventy `output` directory (default `_site`) and are only re-written if they are removed. During production, these files will be re-generated and written to the `public` directory, which is copied by 11ty through to the final build in `_site`. As a result, running sequential production _or_ development builds is optimized, though if you are switching _between_ development and production builds you will notice a slower build time as the IIIF processing is re-running.
