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
- Add `id` to Sequence class, fixes preview rebuild with image sequences.

## [1.0.0-rc.10]

### Added
- `accordion` and `accordionGlobalControls` shortcodes
- Adds `addPairedShortcode` to shortcode factory to provide page to paired shortcodes

### Changed
- Overwrite `markdown-it-footnote` footnote_ref and footnote_tail rules to not rely on `state.env` but to render footnotes and footnote reference in place, which allows footnotes to be created within shortcodes that render markdown using the markdownify filter
