# Figures

## `FigureMediaFactory`
Creates `FigureMedia` instances and calls `Figure.processFiles()` to generate assets for consumption by shortcodes.

## `FigureMedia`
Stores `figures.yaml` data and wraps media creation methods like `processFiles`.

### `processFiles`
Files are written to `<iiifConfig.dirs.outputRoot>/<iiifConfig.dirs.output>/<figure.id>` (default: `/_site/iiif/<figure.id>`).

#### Image processing 
Processes image files in `figure.src` and `annotation.src`. Image processing includes creating tiles if the resource is an image service and performing image transformations.

#### Manifest generation
Generates a IIIF manifest for figures with annotations and figures with a single image and `zoom=true`.
