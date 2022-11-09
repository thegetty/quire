## CLI Quire Module

The primary concern of the Quire CLI `quire` module is to decouple the `11ty` package from the publication content templates and manage the version of the [Quire/11ty package](packages/11ty) that is used to build a Quire project.

The [Quire/11ty package](packages/11ty) contains the Eleventy [configuration](packages/11ty/.eleventy.js), [includes](packages/11ty/_includes), [layouts](packages/11ty/_layouts), and [plugins](packages/11ty/_plugins) for [universal template shortcodes](packages/11ty/_plugins/shortcodes) and [components](packages/11ty/_includes/components) to build Quire publications.

When the Quire CLI is installed the latest version of the [11ty package](packages/11ty) is installed in in the `cli/quire/versions/` directory.

```sh
cli/
  quire/
    versions/
      1.0.0/
        _includes/
        _layouts/
        _plugins/
        .eleventy.js
        package.json
```
