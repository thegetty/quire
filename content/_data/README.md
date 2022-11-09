# Global Data

## Data Files

Data files included in the `_data` directory will be added to the project's global data using [Eleventy's configuration API](https://www.11ty.dev/docs/data-global-custom/), which allows the data to be universally accessed from Quire shortcodes and components.

## Computed Data
Data properties that are computed from other global data values are set in `eleventyComputed`. These values are directly available only in layouts and templates; **computed data properties must be explicitly passed to shortcodes and components.**

Computed data, data files, and frontmatter will be combined into a single object and merged according to the [Eleventy data cascade](https://www.11ty.dev/docs/data-cascade/).

## IDs

In all data that contains an `id` property, the `id` must be unique and may only be rendered once in the publication. For example, if you have an image that is displayed multiple times throughout a publication, that entry will need to be copied and have a different id each time it's rendered.

For example, if the same image is referenced in chapter 1 and chapter 2, you could structure your figures as:

**figures.yaml**

```yaml
figure_list:
  - id: `fig.1.1`
    src: images/image.jpg
  - id: `fig.2.5`
    src: images/image.jpg
```

## Working with data in development

Eleventy does not fully reprocess the data cascade if a data property changes while the development server is running. As a result, it's safest to restart the server with any change to a global or computed data property. However, changes to template content or front matter (whether in a template or layout) do _not_ require a server start.
