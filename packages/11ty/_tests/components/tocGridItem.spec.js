/**
 * figures.spec.js
 *
 * Tests for the `figures` plugin
 *
 **/
// import esmock from 'esmock'
// import { fileURLToPath } from 'url'
// import fs from 'fs'
// import path from 'path'
// import sinon from 'sinon'
import test from 'ava'
import tocGridItemImage from '../../_includes/components/table-of-contents/item/image.js'

test('Table of Contents Grid Item Image should use thumbnails metadata if available', (t) => {
  const imageComponent = tocGridItemImage({})

  // Mock figureMedia data
  const figureMedia = {
    derivatives: {
      thumbnail: {
        paths: {
          internal: '/_assets/test.jpg',
          absolute: '/pathname/_assets/test.jpg',
          uri: 'https://example.org/test.jpg'
        },
        dimensions: {
          height: 250,
          width: 250
        }
      }
    }
  }
  const rendered = imageComponent(figureMedia)
  console.log(rendered)
  // TODO: JSDOM the rendered image @src should === figureMedia.derivatives.thumbnail.paths.internal and metadata should match too

  t.fail()
})
