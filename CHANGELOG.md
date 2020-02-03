# Quire Starter Theme Change Log

All notable changes to the `quire-starter-theme` will be documented in this file. 

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), 
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

## [0.18.0] - 2020-02-03
### Added
+ Cypress testing suite
+ CircleCI configuration to run Cypress Tests automatically on each pull request
+ Tests for all major JS functions and elements

### Changed
* Handling of references for bibliographies. Now use `id` instead of `short`.

### Fixed
* search.html to fix ref warning
+ relURL to href and src
* JS bug fixes 
- Removed use of deprecated Hugo variables in templates 
* logic in footer buttons and home page link

### Security
* Updated NodeJS/NPM dependencies

## [0.17.0] - 2019-08-01
### Added
+ Support for tabled figures
+ Option to add in custom JavaScript

### Changed
+ Improved q-contributor shortcode
+ Improved display of citations from the q-cite shortcode
+ Improvements to page layouts online and in pdf

### Fixed
+ Displays image tools and information in fullscreen mode

### Security
* Updated NodeJS/NPM dependencies

[Unreleased]: https://github.com/gettypubs/quire-starter-theme/compare/v0.18.0...HEAD
[0.18.0]: https://github.com/gettypubs/quire-starter-theme/compare/v0.17.0...v0.18.0
[0.17.0]: https://github.com/gettypubs/quire-starter-theme/releases/tag/v0.17.0
