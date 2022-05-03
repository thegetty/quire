---
title: IIIF Demo
weight: 203
layout: essay
---

The following examples demonstrate basic usage of when the `figure` shortcode renders `<canvas-panel>` and `<image-service>` web components.

## Image Service
Images in `figures.yaml` with `preset=zoom` or `media_type="imageservice"` will be tiled and rendered using the `<image-service />` web component.

The tiler output can be found in `content/_assets/_iiif/<image-name>/`

Example:

_figures.yaml_
```yaml
  - id: "example-image-service-2"
    src: figures/mother.jpg
    preset: zoom
```

{% figure "example-image-service-2" %}

## Canvas Panel

Example with external manifest:
_figures.yaml_
```
- id: "example-external-manifest"
  label: "Figure 4"
  canvasId: https://preview.iiif.io/cookbook/3333-choice/recipe/0036-composition-from-multiple-images/canvas/p1
  manifestId: https://gist.githubusercontent.com/stephenwf/19e61dac5c329c77db8cf22fe0366dad/raw/04971529e364063ac88de722db786c97e2df0e6b/manifest.json
  caption: "This is a caption"
```

{% figure "example-external-manifest" %}


## Canvas Panel with Choices from figures.yaml
Specifying `choices` on a figure will prompt the IIIF processing to create a manifest.

The manifest can be found in `content/_assets/_iiif/<figure-id>/` and is also stored in `eleventy` global data.

_figures.yaml_
```
- id: "example-with-choices"
  label: "This is a label"
  choices:
    - src: figures/evans-graveyard.jpg
      label: "Choice #1"
      default: true
    - src: figures/evans-burroughs.jpg
      label: "Choice #2"
```

{% figure "example-with-choices" %}


## Other properties
The canvas panel and image service tags also support the `height`, `preset`, `width`, and `region` properties. See [Canvas Panel Documentation](https://iiif-canvas-panel.netlify.app/docs/examples/responsive-image) for additional details.

_figures.yaml_
```
- id: "example-cropped-canvas"
  region: "3569,761,1851,2059"
  preset: static
  canvasId: https://preview.iiif.io/cookbook/3333-choice/recipe/0036-composition-from-multiple-images/canvas/p1
  manifestId: https://gist.githubusercontent.com/stephenwf/19e61dac5c329c77db8cf22fe0366dad/raw/04971529e364063ac88de722db786c97e2df0e6b/manifest.json
```

{% figure "example-cropped-canvas" %}
