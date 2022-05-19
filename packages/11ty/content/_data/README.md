## Global Data

### Data Files

Data files included in the `_data` directory will be added to the project's global data using [Eleventy's configuration API](https://www.11ty.dev/docs/data-global-custom/), which allows the data to be universally accessed from Quire shortcodes and components.

### Computed Data
Complex data properties that are computed from other global data values are set in `eleventyComputed`. These values are only directly available in layouts and templates. Computed properties must be passed explicitly to shortcodes and components.

Computed data, data files, and frontmatter will be combined into a single object and merged according to the [Eleventy data cascade](https://www.11ty.dev/docs/data-cascade/).
