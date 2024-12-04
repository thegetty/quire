# Changelog

All notable changes to the `quire-11ty` package will be documented in this file.

The log format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog entries are classified using the following labels:
- `Added`: for new features
- `Bumped`: updated dependencies, only minor or higher will be listed
- `Changed`: for changes in existing functionality
- `Deprecated`: for once-stable features removed in upcoming releases
- `Fixed`: for any bug fixes
- `Removed`: for deprecated features removed in this release

## [1.0.0-rc.21]

### Fixed

- `canvas-panel` components were not responding to `ref` tag regions in all cases (`DEV-19079`)
- Video and Table figures were not repsonsive to `ref` tag behaviors (`DEV-18548`)
- Rotate-to-index attribute transitions could underrun their buffer

## [1.0.0-rc.20]

### Changed

- Refactor image-sequence preloadImages to accept an indices parameter of indices to preload and return the promise of all fetch responses
- Adds an animationIndex property for managing animation when rotating

### Fixed

- image-sequence rotation to an index on load
- display of the rotation call to action

## [1.0.0-rc.19]

### Changed

- Performance improvments and refactoring for image sequences:
  - Refactor `q-image-sequence` component to load a buffer of image bitmaps from the image URLs passed to it
  - Refactor `q-image-sequence` to use encapsulated styles at the module level

## [1.0.0-rc.18]

### Changed

- Performance improvements for images:
  - Refactor `figure` subcomponent composition using named `slot` elements for data, ui, slides, and styles
  - Refactor `lightbox` components to generate slides dynamically from JSON data
  - Compiles `lightbox` styles and inserts them in the component's style slot at publication build-time
  - Refactors `image-sequence` as a Lit web component: `q-image-sequence`

## [1.0.0-rc.17]

### Added

- PDF creation for a single quire webpage and cover pages
- PDF transform to template using `_layouts/pdf.liquid` (was: HTML string append)
- Front-end markup for PDF download link

### Bumped

- sharp@0.32` which includes prebuilt binaries that contain patches for macOS 10.13+ support.

## [1.0.0-rc.16]

## [1.0.0-rc.15]

### Added

- Validation method to check if an image can be tiled, and log error if invalid.
- `objects-page` layout. This contains the 'Object Filters' feature, which renders a filterable list of all publication objects.
- `object-filters` WebC components

### Changed

- Increase `print-image` transformation width to `2025px`
- Remove preceding slash from relative paths in epub output
- Updated audio component print output to exclude audio embed and include optional poster image.

### Fixed

- Resolved issue with logic rendering external manifests
- Prefix epub filename with `page-` to ensure validity if filename begins with a number
- Include `svg` definitions in body of epub pages using `svg`
- Ensure relative links with hashes are properly transformed for EPUB output
- Include title in epub manifest if no subtitle

### Removed

- Remove `.jp2` from supported image extensions

## [1.0.0-rc.14]

### Fixed

- Allow input images that are static or tiled to have `.jpeg`, `.tif`, `.tiff`, `.png`, and `.svg` extensions.
- Return unmodified content from pdf/epub transforms, fixing site-only pages markup
- Validate urls and error logging to id generation methods in figure and annotation models
- Enables tiling of base image of annotated canvases

## [1.0.0-rc.13]

### Added

- Adds print `table` component without a modal link
- Import `screen.scss` into `javascript/application/index.js`

### Changed

- Renames `eleventyComputed` property `pageClasses` and frontmatter property `class` to `classes` for consistency, avoiding using the reserved word `class`, and to handle merging template, layout, and computed classes.
- Renames frontmatter property for page-level bibliography entries from `pageReferences` to `citations`

### Fixed

- Sort epub reading order by `url`
- Removed empty `<title>` tags from epub output
- Updated `link` shortcode to only apply anchor tag attributes if they are defined
- Strip HTML from `<title>` tags in epub and site output
- Replace unsupported `<em>` with `<span>` in `_includes/components/citation/page.js` `container-title` property
- Fix setting footnote ids with two or more characters in `_plugins/markdown/footnotes.js`
- Fixed epub video component poster path by allowing path to be handled by the output transforms rather than the component
- Fixed duplicate footnote ids in PDF output by prefixing hrefs and ids with the page id
- Static images are now rendered for image sequences in PDF and EPUB output
- Ensure image assets defined with `background-image: Url(...)` are copied into EPUB package

## [1.0.0-rc.12]

### Added

- Scroll interactions to `ref` shortcode
- Animation to image sequences referenced using the `ref` shortcode

### Changed

- Renames `annoref` shortcode to `ref`
- Uses vertical split layout on `entry` layout with `side-by-side` presentation

### Removed

- `figureRef` shortcode (replaced by `ref` shortcode)

### Fixed

- Add `id` to Sequence class, fixes preview rebuild with image sequences.

## [1.0.0-rc.11]

### Fixed

- Fix missing fonts in PDF output

## [1.0.0-rc.10]

### Added
- `accordion` and `accordionGlobalControls` shortcodes
- Adds `addPairedShortcode` to shortcode factory to provide page to paired shortcodes

### Changed
- Overwrite `markdown-it-footnote` footnote_ref and footnote_tail rules to not rely on `state.env` but to render footnotes and footnote reference in place, which allows footnotes to be created within shortcodes that render markdown using the markdownify filter
