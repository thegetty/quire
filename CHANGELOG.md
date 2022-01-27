# Change Log

All notable changes to this project will be documented in this file.

Changelog entries are classified using the following labels _(from [Keep a changelog](https://keepachangelog.com/en/1.0.0/)_):

Project versions conform to [Semantic Versioning](https://semver.org/)

- `Added`: for new features
* `Bumped`: updated dependencies, only minor or higher will be listed
* `Changed`: for changes in existing functionality
- `Deprecated`: for once-stable features removed in upcoming releases
* `Fixed`: for any bug fixes
- `Removed`: for deprecated features removed in this release

## [0.20.2]
- Adds `disableFastRender` option to `quire preview` command
- Adds `contents-list/file-dir` partial to normalize directories in `contents-list`

## [0.20.1]

### Fixed
- Corrects broken build published to npm

## [0.20.0]

### Added
- Implementation of multi-level subsections
 
## [0.19.2]

### Changed
- Process IIIF images sequentially in `process --iiif` command.

### Fixed
- Include label in image modal caption/credit block
- Wrap Windows Prince command in quotes

## [0.19.1]

### Fixed

- Fix navigation to previously-viewed images in popup by removing Leaflet map on change.

### Changed
- Refactor `q-figure` shortcode to use partials for each media type
- Refactor `q-figure-group` and `q-figure-zoom` shortcodes to use `caption` and `label` partials

## [0.19.0]

### Added
- `quire process --iiif` command to generate IIIF compatible image tiles
- Set an image's zoom level in Leaflet using `zoom_max` in `figures.yml`

### Fixed
- Translate popup annotations so they are always contained by the document body
- Preserve scroll position when image modals are opened and closed

### Changed
- Disabled scroll and touch zoom on entry viewer images
- Update `README` for CLI, default starter, default theme, and monorepo
