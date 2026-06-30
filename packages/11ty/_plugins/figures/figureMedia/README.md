# FiguresMedia
Data model that handles figure media assets and provides normalized asset path data and dimensions for figures.

## `FigureMediaFactory`
A mostly-abstract factory that creates `FigureMedia` instances via the `create` method. `create` calls the new instance's `processFiles` to start the generation of site media assets and model data for use by components.

## `FigureMedia`
Stores `figures.yaml` data, wraps the injection of media creation methods like `processFiles`, and generates new modelled figure media data with the `media` method.

### `processFiles`
Files are written to `<iiifConfig.dirs.outputRoot>/<iiifConfig.dirs.output>/<figure.id>` (default: `/_site/iiif/<figure.id>`).

### `Tiler`
Injectable class providing an abstraction over the `sharp` incantations for generating tiles.

### `Transformer`
Injectable class providing an abstraction over `sharp`'s `resize` method. Options for individual derivative transformations (eg, thumbnail images) are instantiated are configured in the IIIF configuration (see ["Image processing"](#image-processing) below).

Metadata about asset derivatives' paths and dimensions are stored in the `derivatives` property in the object returned by `FigureMedia`'s `media()` method, with each derivative's metadata stored under its transformation and "full" for the complete image.  

#### Image processing 
Processes image files in `figure.src`, `figure.iiif_image`, and `annotation.src`.

Tiles are only created for figure images with `zoom` set to `true`. Transformed derivative images are created for all figure images, see `_plugins/figures/iiif/config.js` for details. Transform `resize` options are largely pass-through to the `sharp` method. 

#### Manifest generation
Generates a IIIF manifest for figures with annotations and figures with a single image and `zoom` set to `true`.
