/**
 * Export all figure JSON
 */

module.exports = {
  checkboxAnnotations: {
    figure: require('./checkbox-annotations/figure.json'),
    manifest: require('./checkbox-annotations/manifest.json')
  },
  radioLayers: {
    figure: require('./radio-layers/figure.json'),
    manifest: require('./radio-layers/manifest.json'),
  },
  rotating: {
    figure: require('./rotating/figure.json'),
    manifest: require('./rotating/manifest.json')
  },
  rotatingAnnotation: {
    figure: require('./rotating-annotation/figure.json'),
    manifest: require('./rotating-annotation/manifest.json')
  },
  zoom: {
    figure: require('./zoom/figure.json'),
    manifest: require('./zoom/manifest.json')
  }
}
