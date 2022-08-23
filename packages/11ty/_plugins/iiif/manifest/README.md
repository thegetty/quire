# IIIF Manifests

The Quire figure model is a simple interface for creating IIIF manifests that are rendered by Quire's `figure` shortcode using the [`<canvas-panel>`](https://iiif-canvas-panel.netlify.app/docs/intro/) web component.

## Process
Quire's IIIF processing parses the `figures.yaml` data and for each figure writes a manifest file to the directory `/public/iiif/<figure.id>.json`. A list of manifests is also added to the eleventy global data object `eleventyConfig.globalData.iiifManifests[figure.id]`.

## Annotations Model
| Property    | Description                  |
| ----------- | ---------------------------- |
| input       | `checkbox`|`radio` (default) |
| items       | Array\{Annotation Items\}    |

## Annotation Item Model
| Property | Description                                                  |
| -------- | ------------------------------------------------------------ |
| src      | The image file path relative to `iiifConfig.inputDir` |
| label    | The input label; if not provided, the filename converted to title case will be used. |

## Features
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
