# IIIF Processing
Quire's IIIF processing provides methods to prepare images to IIIF 3.0 specification for use with [`canvas-panel`](https://iiif-canvas-panel.netlify.app/docs/components/cp) and [`image-service`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service) web components.

## Setup
- Set `baseURL` in `config.yaml`. This will be used to generate IIIF `@id` properties.

## Config
Configuration options can be found in `_plugins/iiif/config.js`.

## Options
`debug` {Boolean}
If true, logs IIIF processing steps for each image to console. Default: `false`.

`lazy` {Boolean}
If true, skips processing images that have previously been processed. If false, re-processess all images. Default: `true`.

## Global Data
Figures rendered using the `canvas-panel` web component will have the `canvas`, `manifest`, `choices` (if relevant) and `choiceId` (if relevant) properties added to their figure objects in `globalData.figures`.

## Image Tiling
Quire uses [`sharp`](https://sharp.pixelplumbing.com/api-output#tile) to generate a IIIF image service for all images in the `figures` directory with the `zoom` preset. When these images are used with the `figure` shortcode, they will be rendered using an [`<image-service/>`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service) web component. The output for each image includes the original image, thumbnail image, and tiles.

## Manifests with Choices
Quire's IIIF processing uses the [`iiif-builder`](https://github.com/stephenwf/iiif-builder) to create manifests with choices from figures in `figures.yaml` that have the `choices` property and write them to the IIIF output directory (default: `_iiif/`) and [eleventy global data](https://www.11ty.dev/docs/data-global-custom/#global-data-from-the-configuration-api).

Images referenced in `choices` should have the same dimensions, and be included in the `figures` directory.

### Properties
`id` {String}
The image id to use in a `figure` shortcode.

`default` {Boolean} Default: false
If true, renders this image initially.

`label` {String}
The input label for this choice.

`src` {String}
The relative path from `_assets/images` to the image file.

### Usage
_figures.yaml_
```yaml
- id: "animal"
  label: "Animal"
  choices:
    - id: "cat"
      default: true
      label: "A Cat"
      src: figures/cat.jpg
    - id: "dog"
      label: "A Dog"
      src: figures/dog.jpg
```
