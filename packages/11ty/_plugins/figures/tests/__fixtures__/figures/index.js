/**
 * Export all figure JSON
 */

module.exports = {
  annotationsCheckbox: {
    figure: require('./annotations-checkbox/figure.json'),
    manifest: require('./annotations-checkbox/manifest.json')
  },
  annotationsRadio: {
    figure: require('./annotations-radio/figure.json'),
    manifest: require('./annotations-radio/manifest.json'),
  },
  sequence: {
    figure: require('./sequence/figure.json'),
    manifest: require('./sequence/manifest.json')
  },
  sequenceWithAnnotations: {
    figure: require('./sequence-with-annotations/figure.json'),
    manifest: require('./sequence-with-annotations/manifest.json')
  },
  zoomable: {
    figure: require('./zoomable/figure.json'),
    manifest: require('./zoomable/manifest.json')
  }
}
