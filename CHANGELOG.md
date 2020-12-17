# Quire Starter Change Log

All notable changes to the `quire-starter` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added
- Config parameter to specify bibliography heading: `biblioHeading`
- Use of `identifer.url` in publication.yml for use in Cite This feature, and eventually also in site metadata

## [0.18.0] - 2020-02-03 
### Added
+ Add CircleCI config

### Changed
+ site.xml to work with Netlify deploy method
+ moved package.json back to theme
- For Markdown rendering, removed Blackfriday config and used Goldmark config instead
* Changed `short` to `id` in references.yml to support revised bibliogrpahy shortcode

### Fixed
+ Fixed insecure assets
* Use of superscript in object dimensions
* Page-to-page link syntax

## [0.17.0] - 2019-08-01
### Added
+ Add config params to support new options in contributor and citation handling

### Changed
+ Change type to format in q-contributor shortcode use

[Unreleased]: https://github.com/gettypubs/quire-starter/compare/v0.18.0...HEAD
[0.18.0]: https://github.com/gettypubs/quire-starter/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/gettypubs/quire-starter/releases/tag/v0.17.0
