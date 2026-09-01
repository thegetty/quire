## Figures Plugin

Quire's figures plugin provides methods to prepare images and media for use with front-end components. It produces single-file derivatives (thumbnails, etc) used throughout quire publications, generates tiled image derivatives for zoomable images, and calculates media asset paths and URLs.

For figures that are configured to be zoomable, the plugin produces directory hierarchies of tiles conforming to [IIIF Image API 2.0](https://iiif.io/api/image/2.0/). It also generates [IIIF Presentation API 3.0](https://iiif.io/api/presentation/3.0/) manifests for zoomable figures, figures with annotations, and figures with image sequences. Within quire the IIIF manifests are used with the [`canvas-panel`](https://iiif-canvas-panel.netlify.app/docs/api-reference/canvas-panel), [`image-service`](https://iiif-canvas-panel.netlify.app/docs/components/single-image-service), and `q-image-sequence` web components.

### Processing Configuration

The plugin loads its image processing configuration from [`_plugins/figures/iiif/config.js`](iiif/config.js). A few required properties control figure processing and IIIF behaviors:

  - `baseURI`: base URI to use for IIIF Presentation `@id` properties. When running the Eleventy development server the `baseURI` is set to `localhost`.
  - `formats`: maps image input formats to output formats. By default all input image formats are output as JPEGs.
  - `hostExternal`: whether to host IIIF sources (eg, `iiif_id`) in this publication. Defaults to true.
  - `transformations`: options used with `sharp` for generating derivative images. Each entry in the array generates a named derivative in the the publication's `/iiif` directory. Defaults to emitting derivatives at `full` (entire image), `thumbnail` (320px wide), `print-image` (2500px wide), and `static-inline-figure-image` (640px wide).

### `FigureMedia` API and Global Data

The plugin adds `FigureMedia` objects to 11ty global data. For front-end component writers, these objecst are usually fetched with the `getFigureMedia` filter; the returned objects and are components' primary means of accessing figures data. In addition to the properties supplied by users in `figures.yaml`, `FigureMedia` objects feature properties prepared for use by components:
  
- `derivatives`: An map of derivative names (from `transformations`, above) to objects containing `paths` and `dimensions` for that derivative. `paths` provides an `internal` property with the asset path for this figure when emitted internal to the publication (before asset bundling), an `absolute` property with the asset path for this figure when emitted in the final deployment, and a `uri` property with the fully qualified URI for this figure.

The contents of these objects are determined by the figure type: 
  - For figure images, the derivative names available are those configured by `transformations` for each figure image -- `full`, `printImage`, `staticInlineFigureImage`, and `thumbnail`.
  - For embedded figure types like `youtube`, `soundcloud`, and `vimeo`, `derivatives` contains an `embed` object containing the figure's `sourceUrl` and `embedUrl`. `poster`, if available, is emitted on `full` keys.
  - For video figures, `embed` will contain a `media` object with the same path structures `internal` for the video asset file. `poster`, if available, is emitted on `full` keys.

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

### Processing Figures

The plugin iterates entries in `figures_list` of `figures.yaml`. It uses `FigureFactory` to create a `FigureMedia` object from user-supplied YAML data and metadata from the figure's asset file(s).

The Factory object uses direct injection to manage the image transformation functions via an `ImageProcessor` instance the provides scaled derivative transforms and image tiling. The data model for IIIF Presentation manifests are managed via `Manifest`, `Annotation`, and `Sequence` models.

For each image in the publication, the plugin creates a full image, a thumbnail image, a static image on-page usage, and a print-sized image. For figures that use `zoom: true` the plugin creates image tiles stored for retrieval via IIIF image service.

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