# Changelog

All notable changes to the `quire-cli` will be documented in this file.

The log format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog entries are classified using the following labels:
- `Added`: for new features
- `Bumped`: updated dependencies, only minor or higher will be listed
- `Changed`: for changes in existing functionality
- `Deprecated`: for once-stable features removed in upcoming releases
- `Fixed`: for any bug fixes
- `Removed`: for deprecated features removed in this release

## [1.0.0-rc.12]

### Added
- Handling for single-page PDFs
- Paged and Prince plugins to map quire pages to PDF page sections 

### Changed

- `quire clean` also removes `.11ty-vite` in the project root

## [1.0.0-rc.11]

### Bumped
- `epubjs-cli` to version 0.1.6
- `pagedjs-cli` to version 0.4.3

### Fixed
- EPUB validation error where pages that include SVGs must include SVG as property under `readingOrder`

## [1.0.0-rc.10]

### Added
- Support semantic version ranges for `quire-11ty` in quire starter projects and the `--quire-version` option of the `quire new` command, and use the latest compatible `quire-11ty` version when creating and installing a new project.

## [1.0.0-rc.9]

### Added
- Update old `.quire` files  when running `info` command on versions prior to `1.0.0-rc.8`
- Include `quire-cli` version used to generate project in `info` output
- Adds headings to `info` output

## [1.0.0-rc.8]

### Added
- Added `info` command to output package versions

## [1.0.0-rc.7]

### Added
- Added `new` command `--quire-path` option to support development with local version of `quire-11ty`
