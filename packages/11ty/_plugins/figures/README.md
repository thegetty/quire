## Figures Processing

Quire's figures processing provides methods to prepare images for use with Quire front-end components. It produces single-file derivatives (thumbnails, etc) used throughout the publication. For figures that are configured to be zoomable it also produces directory hierarchies of tiles conforming to [IIIF Image API 2.0](https://iiif.io/api/image/2.0/). It produces [IIIF Presentation API 3.0](https://iiif.io/api/presentation/3.0/) for figures that are zoomable, have annotations, or are a sequence.

Currently these manifests are used with the [`canvas-panel`](https://iiif-canvas-panel.netlify.app/docs/api-reference/canvas-panel), [`image-service`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service), and `q-image-sequence` web components.

### Processing Configuration

The plugin loads its image processing configuration from [`_plugins/figures/iiif/config.js`](iiif/config.js). A few required properties control figure processing and IIIF behaviors:

  - `baseURI`: base URI to use for IIIF Presentation `@id` properties. When running the Eleventy development server the `baseURI` is set to `localhost`.
  - `formats`: maps image input formats to output formats. By default all input image formats are output as JPEGs.
  - `hostExternal`: whether to host IIIF sources (eg, `iiif_id`) in this publication. Defaults to true.
  - `transformations`: options used with `sharp` for generating derivative images. Each entry in the array generates a named derivative in the the publication's `/iiif` directory. Defaults to emitting derivatives at `full` (entire image), `thumbnail` (320px wide), `print-image` (2500px wide), and `static-inline-figure-image` (640px wide).

### Processing Figures

The plugin iterates entries in `figures_list` of `figures.yaml`. It uses `FigureFactory` to create a `FigureMedia` object from user-supplied YAML data and metadata from the figure's asset file(s).

The Factory object uses direct injection to manage the image transformation functions via an `ImageProcessor` instance the provides scaled derivative transforms and image tiling. The data model for IIIF Presentation manifests are managed via `Manifest`, `Annotation`, and `Sequence` models.

For each image in the publication, the plugin creates a full image, a thumbnail image, a static image on-page usage, and a print-sized image. For figures that use `zoom: true` the plugin creates image tiles stored for retrieval via IIIF image service.

### `FigureMedia` Data Model and Global Data

The plugin adds `FigureMedia` instances to 11ty global data after processing. `FigureMedia` has all the properties supplied by users and these additional properties:
  
- `annotations`: Annotations from `figures.yaml` will have `type` and `url` properties.

- `canvasId`: URI of the IIIF canvas panel.

- `info`: Path to the image service `info.json` relative to the project root.
  
- `manifestId`: URI of the IIIF manifest.

- `dimensions`: an object of derivative dimensions, with derivative names (eg, `"print"` as keys).

- `isCanvas`: the figure has a canvas representation.

- `isExternalResource`: the figure is external to the publication (eg, supplied via CDN).

- `isImageService`: the figure is an IIIF image service.

- `isSequence`: the figure has a sequence.

- `mediaType`: asset media type -- figures without a user-supplied `media_type` emit "image".

### Image Tiling

Quire uses [`sharp`](https://sharp.pixelplumbing.com/api-output#tile) to generate image tiles for figures listed in `figures_list` of `figures.yaml` that have `zoom` set to `true`. When these images are used with the `figure` shortcode they are rendered using [`<image-service/>`](https://iiif-canvas-panel.netlify.app/docs/api-reference/single-image-service) elements from `canvas-panel`.

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
          <transformations...>
          <tile-directories...>
          info.json
      <image-name>/
        <iiifConfig.tilesDirName>/
          <transformations...>
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
        full.jpg
        print.jpg
        static-inline-figure-image.jpg
        thumbnail.jpg
        tiles/
          <tile-directories...>
          info.json
      <image-name>/
        full.jpg
        print.jpg
        static-inline-figure-image.jpg
        thumbnail.jpg
        tiles/
          <tile-directories...>
          info.json
      manifest.json
```
