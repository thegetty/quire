# IIIF Processing
Quire's IIIF processing provides methods to prepare images to IIIF 3.0 specification for use with [`canvas-panel`](https://iiif-canvas-panel.netlify.app/docs/components/cp) and [`image-service`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service) web components.

Processing iterates over the figure entries in `figures.yaml` and creates a `FigureFactory` instance which manages the figure data, and calls the `process` method which generates image tiles, IIIF manifests, and performs image transformations and updates the global `figure` data with properties generated from those processes.

## Setup
- Set `baseURL` in `config.yaml`. This will be used to generate IIIF `@id` properties.

## Config
IIIF configuration options can be found in `_plugins/figures/iiif/config.js`.

## Global Data
Figures rendered using the `canvas-panel` web component will have these additionalproperties:
`annotations`: Annotations from `figures.yaml` will have `type` and `url` properties
`canvasId`: The id of the IIIF canvas
`manifestId`: The id of the IIIF manifest

## Image Tiling
Quire uses [`sharp`](https://sharp.pixelplumbing.com/api-output#tile) to generate a IIIF image service for all images in the `figures` directory with the `zoom` preset. When these images are used with the `figure` shortcode, they will be rendered using an [`<image-service/>`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service) web component. The output for each image includes the original image, thumbnail image, and tiles.

## Manifests with Annotations
Quire's IIIF processing uses the [`iiif-builder`](https://github.com/stephenwf/iiif-builder) to create manifests with annotations from figures in `figures.yaml` that have the `annotations` property and write them to the IIIF output directory (default: `iiif/`) and [eleventy global data](https://www.11ty.dev/docs/data-global-custom/#global-data-from-the-configuration-api).
