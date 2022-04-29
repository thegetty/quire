## Usage
TODO: document other figure types (soundcloud, table, vimeo, youtube)

### Image service (zoomable images)
_figures.yaml_
```yaml
- id: "bells"
  caption: "Pitched percussion idiophone"
  preset: zoom
  src: figures/chime-bells.jpg
```

### External Image Service
_figures.yaml_
```yaml
- id: "bells"
  caption: "Pitched percussion idiophone"
  src: https://www.example.com/chime-bells/info.json
```

### User-generated Manifests
Manifests added to the `_assets` directory will be passed through to the build. You can render a canvas in a figure by specifying the `canvasId` and `manifestId` in `figures.yaml`

For example, for a manifest in `_assets/iiif/chime-bells/manifest.json` with a canvas with an `id` of `iiif/chime-bells/canvas-1`:

_figures.yaml_
```yaml
- id: "bells"
  canvasId: "iiif/chime-bells/canvas-1"
  manifestId: "iiif/chime-bells/manifest.json"
```

### External Manifests
_figures.yaml_
```yaml
- id: "bells"
  canvasId: "https://example.org/chime-bells/canvas-1"
  manifestId: "https://example.org/chime-bells/manifest.json"
```

### Images with Choices
#### Defined in figures.yaml
_figures.yaml_
```yaml
- id: "cat1"
  label: "Cat"
  choices:
    - src: figures/cat-photo.jpg
      default: true
      label: "Photograph"
    - src: figures/drawing-of-cat.jpg
      label: "Drawing"
```

#### Defined in an external manifest
Specify the initial image to display using the `choiceId` property.

_figures.yaml_
```yaml
- id: "bells"
  canvasId: "https://example.org/chime-bells/canvas-1"
  choiceId: "https://example.org/chime-bells/canvas-1/figure-1"
  manifestId: "https://example.org/chime-bells/manifest.json"
```
