/**
 * Export all figure JSON
 */
export default {
  annotationsCheckbox: {
    dimensions: { height: 1455, width: 1200 },
    figure: await import('./annotations-checkbox/figure.json', { assert: { type: 'json' }}),
    manifest: await import('./annotations-checkbox/manifest.json', { assert: { type: 'json' }})
  },
  annotationsRadio: {
    dimensions: { height: 2868, width: 2082 },
    figure: await import('./annotations-radio/figure.json', { assert: { type: 'json' }}),
    manifest: await import('./annotations-radio/manifest.json', { assert: { type: 'json' }})
  },
  sequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: await import('./sequence/figure.json', { assert: { type: 'json' }}),
    files: await import('./sequence/files.json', { assert: { type: 'json' }}),
    manifest: await import('./sequence/manifest.json', { assert: { type: 'json' }})
  },
  sequenceWithAnnotations: {
    dimensions: { height: 2048, width: 1536 },
    figure: await import('./sequence-with-annotations/figure.json', { assert: { type: 'json' }}),
    files: await import('./sequence-with-annotations/files.json', { assert: { type: 'json' }}),
    manifest: await import('./sequence-with-annotations/manifest.json', { assert: { type: 'json' }})
  },
  zoomable: {
    dimensions: { height: 3221, width: 4096 },
    figure: await import('./zoomable/figure.json', { assert: { type: 'json' }}),
    manifest: await import('./zoomable/manifest.json', { assert: { type: 'json' }})
  },
  zoomableSequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: await import('./zoomable-sequence/figure.json', { assert: { type: 'json' }}),
    files: await import('./zoomable-sequence/files.json', { assert: { type: 'json' }}),
    manifest: await import('./zoomable-sequence/manifest.json', { assert: { type: 'json' }})
  }
}
