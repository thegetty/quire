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