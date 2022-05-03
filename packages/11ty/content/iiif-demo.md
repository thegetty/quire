---
title: IIIF Demo
weight: 203
layout: page
---

## Image Service
Images in `figures.yaml` with `preset=zoom` will be tiled and rendered using the `<image-service />` web component.

The tiler output can be found in `content/_assets/_iiif/<image-name>/`

Example:

_figures.yaml_
```yaml
  - id: "image-service"
    src: figures/evans-legionnaire.jpg
    preset: zoom
```

{% figure id="image-service" %}

## Choices from figures.yaml
Specifying `choices` on a figure will prompt the IIIF processing to create a manifest.

The manifest can be found in `content/_assets/_iiif/<figure-id>/`

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

{% figure id="example-with-choices" %}
