## Eleventy layout templates

> Eleventy layouts are chainable, language-agnostic templates that can be used to wrap other content. To denote that a piece of content should be wrapped in a template, use the `layout` key in your front matter.

See also the [Eleventy layouts documentation](https://www.11ty.dev/docs/layouts/) and [Eleventy documention for optional directory for layouts](https://www.11ty.dev/docs/config/#directory-for-layouts-(optional))

### Data

TODO

### Example Usage

`/content/bibliography.md`
```markdown
---
title: Works Cited
layout: bibliography
order: 200
---
```

### Layouts

#### base
The base layout including scripts, styles, and headtags.

#### bibliography
Renders publication's bibliography from `references.yaml`. Extends `base`.

#### contents
Renders a publication or section table of contents. Extends `base`.

#### contributors
Renders the publication's contributors from `publication.yaml`. Extends `base`.

#### cover
Cover page. Extends `base`.

#### entry
This template is intended for use in catalogue-style pages where a single image or object needs to be featured prominently. Extends `base`.

#### essay
This layout describes a single-page template that has been augmented with the ability to display a frontmatter-defined abstract (in markdown format) as well as bibliography references. Extends `base`.

#### page
A simple page template. Extends `base`.

#### search-index
Raw JSON representation of publication data, used by search.

#### splash
Splash page layout. Extends `base`.

### Page attributes

#### Classes
Classes added to the front matter `class` property of a layout or template are applied to the `<main>` element of that page.

#### IDs
The slugified page url is used for the `id` attribute of the `<main>` element of each page.

#### Example

A default class is set in the layout:

**`_layouts/entry.liquid`**
```yaml
---
classes:
  - quire-entry
---
```

Additional style classes can also be added in a template. These will be appended to the class value set in the layout. The `class` property must use array syntax.

**`content/catalogue/1.md`**
```yaml
---
layout: entry
classes:
  - fancy-custom-class
---
```

The `<main>` element of the built `/catalogue/1` page would then be:

**`_site/catalogue/1/index.html`**
```html
<main id="catalogue-1" class="quire-page quire-entry fancy-custom-class">
  // page content omitted for example
</main>
```
