# IIIF Manifests
The `Manifest` module accepts a `Figure` instance and provides `toJSON()` and `write()` methods for generating and writing a IIIF manifest.

## Features
### Annotations
An `annotation` adds additional information (for example an image) to a canvas.

_figures.yaml_
```yaml
- id: "example-with-annotation"
  label: "Dog"
  src: figures/dog.jpg
  annotations:
    input: checkbox
    items:
      - src: figures/hat.jpg
        label: "Hat"
```

### Choices
`Choices` are a type of annotation that represent alternate views of the same image, for example an x-ray and a photograph of a painting. All `choices` should have the same image dimensions and must not have a `target` property. Choices will be listed in the order they appear in the `YAML`, the first item will be selected by default when the page loads.

#### Usage
_example-template.md_
```liquid
{% figure "example-with-choices" %}
```

_figures.yaml_
```yaml
- id: "example-with-choices"
  label: "This is a label"
  annotations:
    items:
      - src: figures/x-ray.jpg
        label: "Choice #1"
      - src: figures/photo.jpg
        label: "Choice #2"
```
