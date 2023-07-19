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

### Fixed

- Sort epub reading order by `url`
- Removed empty `<title>` tags from epub output
- Updated `link` shortcode to only apply anchor tag attributes if they are defined
- Strip HTML from `<title>` tags in epub and site output

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
