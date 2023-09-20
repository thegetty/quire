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

## [unreleased]

### Added

- Validation method to check if an image can be tiled, and log error if invalid.

### Changed

- Increase `print-image` transformation width to `2025px`
- Remove preceding slash from relative paths in epub output
- Updated audio component print output to exclude audio embed and include optional poster image.

### Fixed

- Resolved issue with logic rendering external manifests
- Prefix epub filename with `page-` to ensure validity if filename begins with a number
- Include `svg` definitions in body of epub pages using `svg`

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
