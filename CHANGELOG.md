# Quire CLI Change Log

All notable changes to the `quire-cli` will be documented in this file. 

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), 
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]
## [v0.18.0] 
### Added
- Rollup configuration for minification
- Jest Test (tests run through each function that is included in the CLI)
- CircleCI configuration to run Jest Tests automatically on each pull request
- async/await instead of .then().catch()
- function to determine what GIT protocol to use to prevent permissions warnings
- eslint configuration

### Changed
- Documentation to reflect changes to install and use of CLI
- Version Number

### Removed
- All author information from files

### Security
- Updated NodeJS/NPM dependencies

## [v0.17.0] - 2019-08-01
### Added
- Prettier formatting 

### Changed
- Ora to use string instead of arrays
- Version Number

### Fixed
- font issue

[Unreleased]: https://github.com/gettypubs/quire-cli/compare/v0.18.0...HEAD
[Unreleased]: https://github.com/gettypubs/quire-cli/compare/v0.17.0...v0.18.0

