# sitemap plugin
This plugin creates quire's sitemap using HTML pages from the publication

## Overview

- The plugin uses https://github.com/quasibit/eleventy-plugin-sitemap to generate sitemap with quire's `publication.url` set as the hostname. Rather than creating a template file (eg, `sitemap.md`), the plugin dyanmically renders the collection using 11ty's render plugin. *NB*: This means the quire sitemap plugin must be loaded after the render plugin.  

- On eleventy.after, the plugin builds the sitemap using pages collections.html and serializes output to `public/sitemap.xml` (or directly to `_site/sitemap.xml` in dev builds)