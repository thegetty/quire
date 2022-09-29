# Annotations

## Annotation Set Model in `figures.yaml`
| Property    | Description                   |
| ----------- | ----------------------------  |
| input       | `checkbox`|`radio` (default)  |
| items       | Array\{Annotation Items\}     |
| title       | The fieldset title for the UI |

## Annotation Item Model in `figures.yaml`
| Property | Description                                                  |
| -------- | ------------------------------------------------------------ |
| id       | Unique id (optional)
| src      | The image file path relative to `iiifConfig.inputDir` |
| label    | The input label; if not provided, the filename converted to title case will be used. |

## `AnnotationFactory`
Handles creating `Annotation` instances for a `Figure`. Iterates over `figure.annotations` and creates annotation sets, the expected data structure for the annotations UI shortcode. `Annotation` instances are created for each item in an annotation set.

## `Annotation`
The `Annotation` instance handles computing additional properties for using the annotation in a IIIF manifest and for rendering the annotation as an option in the annotations UI.
