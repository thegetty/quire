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

## [1.0.0-rc.33]

### Bumped

- Bumped minimum supported node engine verison to 22.

## [1.0.0-rc.31]

### Changed

- Improved accessibility of PDFs generated with prince with `--pdf-profile=PDF/UA-1` flag

### Removed

- Removed `install-npm-version` in favor of `npm pack` and `tar xfz` run as subprocesses
- Removed `patch-package`

## [1.0.0-rc.30]
## [1.0.0-rc.29]

Candidate versions skipped to align with @thegetty/quire-11ty

## [1.0.0-rc.28]

### Fixed

- Fixed issue where `quire pdf` errored and failed (DEV-20270)

## [1.0.0-rc.27]

### Fixed

- Fixed post-v3 `quire info` bug (DEV-19984)

## [1.0.0-rc.26]

### Changed

- Import path using node namespace in the cli info command
- Correct file extension of cmd module called by the cli

## [1.0.0-rc.25]

### Changed

- Use quire-cli config values for quire-11ty version and version file name

### Fixed

- Install path for quire-11ty versions

## [1.0.0-rc.24]

### Changed

- Replace Node `import` assertions (deprecated) with a packageConfig module

### Fixed

- Quire new command fails with newer version of Node #968

## [1.0.0-rc.23]

:warning: broken release candidate

## [1.0.0-rc.22]

:warning: broken release candidate

## [1.0.0-rc.21]

:warning: broken release candidate

## [1.0.0-rc.20]

:warning: broken release candidate

## [1.0.0-rc.19]

### Added

- `jsdoc-to-markdown` to development dependencies
- JSDoc configuration (see https://jsdoc.app/about-configuring-jsdoc)
- Npm script `docs` to run jsdoc-to-markdown

## [1.0.0-rc.18]

### Added

- Quire CLI configuration management using the `conf` package
- `quire conf` command to manage cli configuration properties

## [1.0.0-rc.17]

### Bumped

- `install-npm-version` patch version

### Changed

- update patch `install-npm-version`

## [1.0.0-rc.16]

### Added

- Patch for `install-npm-version`; see https://nodejs.org/en/blog/vulnerability/april-2024-security-releases-2

### Changed

**Nota bene** installing `quire-cli` as a _local package_ requires running `npm install` with the `--install-strategy=nested` flag; installing `quire-cli` as a global node module has not changed.

### Fixed

- Dependency instal error on Windows when running quire new DEV-19124

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
