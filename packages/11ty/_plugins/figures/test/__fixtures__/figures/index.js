/**
 * Export all figure JSON
 */

module.exports = {
  annotationsCheckbox: {
    dimensions: { height: 1455, width: 1200 },
    figure: require('./annotations-checkbox/figure.json'),
    manifest: require('./annotations-checkbox/manifest.json')
  },
  annotationsRadio: {
    dimensions: { height: 2868, width: 2082 },
    figure: require('./annotations-radio/figure.json'),
    manifest: require('./annotations-radio/manifest.json'),
  },
  sequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: require('./sequence/figure.json'),
    files: require('./sequence/files.json'),
    manifest: require('./sequence/manifest.json')
  },
  sequenceWithAnnotations: {
    dimensions: { height: 2048, width: 1536 },
    figure: require('./sequence-with-annotations/figure.json'),
    files: require('./sequence-with-annotations/files.json'),
    manifest: require('./sequence-with-annotations/manifest.json')
  },
  zoomable: {
    dimensions: { height: 3221, width: 4096 },
    figure: require('./zoomable/figure.json'),
    manifest: require('./zoomable/manifest.json')
  },
  zoomableSequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: require('./zoomable-sequence/figure.json'),
    files: require('./zoomable-sequence/files.json'),
    manifest: require('./zoomable-sequence/manifest.json')
  }
}
