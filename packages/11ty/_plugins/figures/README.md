## Figures Plugin

The figures plugin provides media metadata, asset paths, and tiling or scaling for images in quire publications. The processed images are consumed by components and template code using the `figureMedia` global object and a `getFigureMedia(<id-as-string>)` 11ty filter.

## Overview

Before each publication build, the plugin uses the global figure data added by the globalData plugin from `figures.yaml`, `config.yaml`, and `publication.yaml`.

For each entry in `figures_list`, the plugin uses `FigureFactory` to create a `figureMedia` object. Internally, the factory triggers dimensions metadata inspection, image tile and scaled derivative generation, IIIF manifest creation, and path calculations.

In addition, `epub.defaultCoverImage` from `config.yaml` and `promo_image`, `contributor[].image`, and `publisher[].logo` from `publication.yaml` are made available using the `getFigureMedia` interface.

## IIIF Processing

For figures with `zoom` set to true, the plugin provides tiled image directory hierarchies and an IIIF 3.0 Presentation API manifest for use with [`canvas-panel`](https://iiif-canvas-panel.netlify.app/docs/components/cp) and its [`image-service`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service) web components.

### Setup and Configuration

The `baseURI` property set in [`config.yaml`](/content/_data/config.yaml) will be used to generate IIIF `@id` properties.

When running the Eleventy development server the `baseURI` is set to `localhost`.

IIIF configuration options can be found in [`_plugins/figures/iiif/config.js`](iiif/config.js).

### Global Data

Figures rendered using the `canvas-panel` web component will have the following additional properties:
  
`annotations`: Annotations from `figures.yaml` will have `type` and `url` properties.

`canvasId`: URI of the IIIF canvas panel.

`info`: Path to the image service `info.json` relative to the project root.
  
`manifestId`: URI of the IIIF manifest.

### Image Tiling

Quire uses [`sharp`](https://sharp.pixelplumbing.com/api-output#tile) to generate image tiles for all images in the `figures` directory with the `zoom` preset. When these images are used with the `figure` shortcode, they will be rendered using an [`<image-service/>`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service) web component. The output for each image includes the original image, thumbnail image, and image tiles for the IIIF image service.

### Manifests with Annotations

Quire's IIIF processing uses [`@iiif/builder`](https://github.com/IIIF-Commons/iiif-builder) to create manifests with annotations from entries in `figures.yaml` that have an `annotations` property and write a `manifest.json` file to the IIIF output directory (default: `iiif/`) and [eleventy global data](https://www.11ty.dev/docs/data-global-custom/#global-data-from-the-configuration-api).

### Output Directory structure

Output from the IIIF image processing follows the directory structure below.

```sh
<eleventy.directoryAssignments.output>/
  <iiifConfig.dirs.output>/
    <figure-id>/
      <image-name>/
        <iiifConfig.tilesDirName>/
          <tile-directories...>
          info.json
      <image-name>/
        <iiifConfig.tilesDirName>/
          <tile-directories...>
          info.json
      <iiifConfig.manifestFileName>
```

Example:

```sh
_site/
  iiif/
    <figure-id>/
      <image-name>/
        tiles/
          <tile-directories...>
          info.json
      <image-name>/
        tiles/
          <tile-directories...>
          info.json
      manifest.json
```
