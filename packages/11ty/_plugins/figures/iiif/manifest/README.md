# IIIF Manifests
The `Manifest` module accepts a `Figure` instance and provides `toJSON()` and `write()` methods for generating and writing a IIIF Presentation API manifest.

## Figures Data to IIIF Schema Details
Manifests are generated for figures:
- with `zoom: true`
- with annotations (see below)
- with sequences

### Manifests
Each manifest contains a Canvas annotated with an AnnotationPage whose items contain at least one Annotation with `motivation:painting`, whose `service` key points to the Service data for quire's IIIF Image API level 0 implementation. 

IDs for the Canvas and AnnotationPage are mostly just used for internal routing (eg, passing a manifest and canvas ID to display to canvas-panel) and do not provide JSON responses, but note that by community convention painting Annotations must use image-returning URLs even if these URLs are disgarded in favor of using the IIIF Service for image delivery. Quire uses the print-image.jpg as the ID for this canvas.  

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
