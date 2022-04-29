## Image Tiling
All images in the `figures` directory will be tiled and rendered using the `image-service` tag.
If the tiler is re-run, images will not be re-processed unless `lazy=false` is specified

## Usage
### Setup
- Set `baseURL` in `config.yaml`. This will be used to generate IIIF `@id` properties.

### Image service (zoomable images)
```yaml
- id: "gradoo"
  caption: "La dee da"
  credit: "Ta da"
  src: figures/gradoo.jpg
  zoom: true
```

### External Image Service
_figures.yaml_
```yaml
- id: "gradoo"
  caption: "La dee da"
  credit: "Ta da"
  src: https://www.example.com/gradoo/info.json
```

### User-generated Manifests
Manifests added to the `_assets` directory will be passed through to the build. You can render a canvas in a figure by specifying the `canvasId` and `manifestId` in `figures.yaml`

For example, for a manifest in `_assets/iiif/gradoo/manifest.json` with a canvas with an `id` of `iiif/gradoo/canvas-1`:

_figures.yaml_
```yaml
- id: "gradoo"
  canvasId: "iiif/gradoo/canvas-1"
  manifestId: "iiif/gradoo/manifest.json"
```

### External Manifests
_figures.yaml_
```yaml
- id: "gradoo"
  canvasId: "https://example.org/gradoo/canvas-1"
  manifestId: "https://example.org/gradoo/manifest.json"
```
_example.md_
```liquid
{% figure id="gradoo" %}
```

### IIIF Choices
The figure shortcode includes a UI for IIIF manifests with choices, which can be used to toggle between multiple views of the same image.


#### Defined in figures.yaml
Choices must be images of the same size. You can specify which image to display initially by setting `default: true` on the image choice.

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

#### Defined in a manifest
_figures.yaml_
```yaml
- id: "gradoo"
  canvasId: "https://example.org/gradoo/canvas-1"
  choiceId: "https://example.org/gradoo/canvas-1/figure-1"
  manifestId: "https://example.org/gradoo/manifest.json"
```

Commands
- `quire preview`
  - Preview project and process images
  - This will take a long time the first time it runs if the project contains large images
- `quire preview --skip-image-processing`
  - Preview project, do not process new images
- `quire process --iiif`
  - Process IIIF images
- `quire build`
  - Processes any new images (if unprocessed)

Todo
- change iiif id in info.json to baseURL
- make src optional
