import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function resolver = (path) => join(import.meta.dirname, path)
function readJson = (path) => JSON.parse(readFileSync(resolver(path)))

/**
 * Export all figures fixture data
 */
export default {
  annotationsCheckbox: {
    dimensions: { height: 1455, width: 1200 },
    figure: readJson('./annotations-checkbox/figure.json'),
    manifest: readJson('./annotations-checkbox/manifest.json')
  },
  annotationsRadio: {
    dimensions: { height: 2868, width: 2082 },
    figure: readJson('./annotations-radio/figure.json'),
    manifest: readJson('./annotations-radio/manifest.json')
  },
  sequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: readJson('./sequence/figure.json'),
    files: readJson('./sequence/files.json'),
    manifest: readJson('./sequence/manifest.json')
  },
  sequenceWithAnnotations: {
    dimensions: { height: 2048, width: 1536 },
    figure: readJson('./sequence-with-annotations/figure.json'),
    files: readJson('./sequence-with-annotations/files.json'),
    manifest: readJson('./sequence-with-annotations/manifest.json')
  },
  zoomable: {
    dimensions: { height: 3221, width: 4096 },
    figure: readJson('./zoomable/figure.json'),
    manifest: readJson('./zoomable/manifest.json')
  },
  zoomableSequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: readJson('./zoomable-sequence/figure.json'),
    files: readJson('./zoomable-sequence/files.json'),
    manifest: readJson('./zoomable-sequence/manifest.json')
  }
}
