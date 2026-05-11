# Figures

## `FigureFactory`
Creates `Figure` instances and calls `Figure.processFiles()` to generate assets for consumption by shortcodes.

## `Figure`
Takes figure entry data from `figures.yaml` and creates a `Figure` instance with the `processFiles` method.

### `processFiles`
Files are written to `<iiifConfig.dirs.outputRoot>/<iiifConfig.dirs.output>/<figure.id>` (default: `/_site/iiif/<figure.id>`).

#### Image processing 
Processes image files in `figure.src` and `annotation.src`. Image processing includes creating tiles if the resource is an image service and performing image transformations.

#### Manifest generation
Generates a IIIF manifest for figures with annotations and figures with a single image and `zoom=true`.
