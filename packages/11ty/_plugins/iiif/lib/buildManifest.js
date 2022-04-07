// /**
//  * Manifest Builder
//  * 
//  * @todo 
//  * - set baseURL from config.params.baseURL
//  * - get height and width from image
//  * - write file
//  */

// const { IIIFBuilder } = require('iiif-builder')
// const { globalVault } = require('@iiif/vault')

// const vault = globalVault()
// const builder = new IIIFBuilder(vault)

// module.exports = () => {
//   const baseURL = `https://example.org/${id}`
//   manifestId = `${baseURL}/manifest.json`
//   canvasId = `${baseURL}/canvas`

//   const width = 2000 
//   const height = 1271

//   const manifest = builder.createManifest(manifestId, (manifest) => {
//     // manifest.addLabel('Image 1', 'en')
//     manifest.createCanvas(canvasId, (canvas) => {
//       canvas.width = width
//       canvas.height = height
//       canvas.createAnnotation(`${baseURL}/canvas/annotation`, {
//         id: `${baseURL}/canvas/annotation`,
//         type: 'Annotation',
//         motivation: 'painting',
//         body: {
//           type: 'Choice',
//           items: choices.map(({ id, label }) => {
//             return {
//               id: `${baseURL}/canvas/annotation/choices/${id}`,
//               height,
//               label: { en: [label] },
//               width,
//             }
//           }),
//         },
//       })
//     })
//   })
//   console.warn('generatedManifest:',  manifest)
//   return manifest
// }
