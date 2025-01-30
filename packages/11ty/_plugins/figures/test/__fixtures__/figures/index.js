import fs from 'node:fs'
import path from 'node:path'
/**
 * Export all figure JSON
 */

export default {
  annotationsCheckbox: {
    dimensions: { height: 1455, width: 1200 },
    figure: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './annotations-checkbox/figure.json'))),
    manifest: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './annotations-checkbox/manifest.json')))
  },
  annotationsRadio: {
    dimensions: { height: 2868, width: 2082 },
    figure: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './annotations-radio/figure.json'))),
    manifest: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './annotations-radio/manifest.json')))
  },
  sequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './sequence/figure.json'))),
    files: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './sequence/files.json'))),
    manifest: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './sequence/manifest.json')))
  },
  sequenceWithAnnotations: {
    dimensions: { height: 2048, width: 1536 },
    figure: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './sequence-with-annotations/figure.json'))),
    files: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './sequence-with-annotations/files.json'))),
    manifest: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './sequence-with-annotations/manifest.json')))
  },
  zoomable: {
    dimensions: { height: 3221, width: 4096 },
    figure: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './zoomable/figure.json'))),
    manifest: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './zoomable/manifest.json')))
  },
  zoomableSequence: {
    dimensions: { height: 2160, width: 1827 },
    figure: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './zoomable-sequence/figure.json'))),
    files: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './zoomable-sequence/files.json'))),
    manifest: JSON.parse(fs.readFileSync(path.join(import.meta.dirname, './zoomable-sequence/manifest.json')))
  }
}
