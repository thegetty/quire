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

## [1.0.0-rc.33]

### Added

- Added `iiif_image` property to Figure factory and schema. When passed an IIIF Image API URL (eg, `iiif_image: "https://media.getty.edu/iiif/image/aedba790-5d99-4eec-9453-103efd6a1429"`) the IIIF URL will be used to source image tiles and static-sized derivatives for this figure.

### Changed 

- Ensured that `isExternalResource` is passed through the Figure adapter to data consumers.

### Bumped

- Bumped minimum supported node engine version to v22.

### Fixed

- Fixed various pathing issues for image files used in the epub and pdf outputs.

## [1.0.0-rc.32]

### Bumped

- Moved `@11ty/eleventy` to 3.1.0. Resolves issue in 1.0.0-rc.31 where new projects would fail to build.

## [1.0.0-rc.31]

### Added

- Integration tests for Linux, macos, and Windows. 

### Fixed

- Ensure SVG icons are included in the markup passed to the PDF generators.
- Corrects IIIF identifiers to use '/' as path separator on Windows.
- Corrects separator of paths passed to the `vite` copy plugin use '/' on windows.
- Fixes paths used in figures plugin to be platform-specific when referring to disk assets and '/'-separated when in a URL context. 

## [1.0.0-rc.30]

### Fixed

- Ensure `@src` attributes on img tags always use URL path separators - DEV-20272
- Ensure paths in epub transform are correctly normalized to the platform - DEV-20270 / DEV-20269
- Update signature of `assetFileNames` in `vite` config to handle input paths - DEV-20316

## [1.0.0-rc.29]

### Fixed

- Fixes an issue where externally-hosted IIIF images did not appear in object grids - DEV-19295
- Filepaths + renderOutputs - DEV-20261
- Preprocessor check / HTML page - DEV-19983
- IIIF assets were not generating - DEV-20272
- Fixes pathing for epub cover - DEV-20269

## [1.0.0-rc.28]

### Bumped

- `@11ty/eleventy-img` to v6.0.1
- `@11ty/eleventy-navigation` to v1.0.1
- `@11ty/eleventy-plugin-vite` to v6.0.0

### Fixed

- `DEV-19999`: import.meta.dirname in table of contents component breaks builds on Windows 
- `DEV-20261`: Figure components not rendering in HTML representations

## [1.0.0-rc.27]

### Added

- Sitemap plugin for quire publications

### Changed

- Allow TOC images to be externally hosted

### Fixed

- Handling of table figures so they are not added to 11ty templates
- Corrected search JSON output path when using a directory other than `_site`
- Escaped HTML entities in OpenGraph page `<meta>` tags
- MLA citations in menu
- Windows URI/URL issues with file imports [DEV-19999]

## [1.0.0-rc.26]

### Removed

- `patch-package` dependency

## [1.0.0-rc.25]

### Changed

- Make `patch-package` a core dependency

## [1.0.0-rc.24]

### Changed

- Replaced in-text placeholder for IIIF choice figures with user-controlled choices + UI

## [1.0.0-rc.23]

### Bumped

- Update `@11ty/eleventy` and `@11ty/eleventy-plugin-vite` to Eleventy v3

### Breaking

This release is updates the *major* version of `eleventy`, which requires using ECMAScript module (ESM) syntax for JavaScript code. Specifically, ESM `import` statements to use other modules and the `import.meta.url` property for a module's file path from within that module. For most Quire users this update should be transparent. For publications that have customized the quire code or import packages that are not already in the publication's package dependency tree changes may be needed to address ESM conformance to the custom modules.

## [1.0.0-rc.22]

### Changed

- Patch `@11ty/eleventy-plugin-vite` 11ty/eleventy-plugin-vite/issues/22

### Fixed

- Windows EPERM error when running `quire build`, DEV-13837

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
