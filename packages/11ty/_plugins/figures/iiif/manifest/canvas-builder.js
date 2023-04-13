module.exports = class CanvasBuilder {
  static create(manifest, data) {
    const canvasBuilder = new CanvasBuilder(data)
    canvasBuilder.createCanvases(manifest)
  }

  constructor(data) {
    this.annotations = data.annotations
    this.choices = data.choices
    this.figure = data.figure
    this.sequenceItems = data.sequenceItems
  }

  get canvases() {
    if (this.figure.isSequence) {
      return this.sequenceItems.map((item) => {
        return {
          annotations: [item],
          height: this.figure.canvasHeight,
          id: item.target,
          width: this.figure.canvasWidth
        }
      })
    } else {
      return [
        {
          annotations: this.annotations,
          choices: this.choices,
          height: this.figure.canvasHeight,
          id: this.figure.canvasId,
          width: this.figure.canvasWidth
        }
      ]
    }
  }

  createCanvasAnnotations(canvas, item) {
    const { annotations, choices, height, width } = item
    canvas.height = height
    canvas.width = width
    if (annotations) {
      annotations.forEach((item) => {
        canvas.createAnnotation(item.id, item)
      })
    }
    if (choices) {
      canvas.createAnnotation(choices.id, choices)
    }
  }

  createCanvases(manifest) {
    this.canvases.forEach((item) => {
      manifest.createCanvas(item.id, (canvas) => {
        this.createCanvasAnnotations(canvas, item)
      })
    })
  }
}
