# Annotations


Annotations and Annotation Sets are modeled in the `figures.yaml` data file

## `AnnotationSet`
| Property    | Description                   |
| ----------- | ----------------------------  |
| input       | `checkbox`|`radio` (default)  |
| items       | Array\{Annotation Items\}     |
| title       | `fieldset` title for the UI   |

## `Annotation` Item
| Property | Description                                                  |
| -------- | ------------------------------------------------------------ |
| id       | Unique id (optional)
| src      | The image file path relative to `iiifConfig.inputDir` |
| label    | The input label; if not provided, the filename converted to title case will be used. |

_figures.yaml_
```yaml
figure_list:
  - id: "fig-032"
    src: "figures/032/base.jpg"
    label: "Figure 32"
    zoom: true
    annotations:
      - input: checkbox
        items:
          - src: "figures/032/armature.png"
            label: "Armature"
          - src: "figures/032/wax-joints.png"
            label: "Wax-to-Wax Joints"
```

## `AnnotationFactory`
Handles creating `Annotation` instances for a `Figure`. Iterates over `figure.annotations` and creates annotation sets, the expected data structure for the annotations UI shortcode. `Annotation` instances are created for each item in an annotation set.

## `Annotation`
The `Annotation` instance handles computing additional properties for using the annotation in a IIIF manifest and for rendering the annotation as an option in the annotations UI.
