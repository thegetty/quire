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

## [2.9.0]

### Fixed

- Removes deprecated `ref` shortcode from figure callouts, closes @thegetty/quire#886 

## [2.8.0]

### Changed

- Rename `class` frontmatter property to `classes`

## [2.7.0]

### Added

- Include `screen.scss` screen-only stylesheet

## [2.6.0]

### Changed

- Update styles and templates to support refactored `ref` shortcode with scroll interactions.

## [2.5.0]

### Fixed

- Fix missing fonts in PDF output:
  - Rename `content/_assets/styles/fonts.scss` to `content/_assets/fonts/index.scss`
  - Remove import statement for font stylesheet in `content/_assets/styles/application.scss`

## [2.4.0]

### Fixed

- Copyright page layout and styles

### Removed

- Page number on copyright page 
- About page from PDF and EPUB output

## [2.3.0]

### Fixed

* Handling of text and background colors between classic and modern themes

### Removed

- Figure borders for classic theme

## [2.2.0]

### Fixed

* Figure label alignment
* Line breaks in bulleted lists
* Table styles
* Drop caps
* Line spacing on links

## [2.1.0]

### Added

- CSS styles to ensure entry images and captions stay on the same PDF page, no matter their size

### Fixed

* Background color of entry pages in the PDF (noting that paged.js doesn't support cmyk colors, while PrinceXML does)
* CSS styles for entry page figure captions in the PDF

## [2.0.0]

### Removed

- Javascript and `eleventyComputed.js` which are now committed to the `quire` repository.

## [1.2.0]

### Added

- Dotted leaders in table of contents for PrinceXML

### Fixed

* Use of base-font-size variables
* Page footers in PDF

## [1.1.0]

### Changed

* Location of SCSS variables for pdf margins

### Fixed

* CSS styles for headings
* Page height for the PDF outputs

## [1.0.0-pre-release]
