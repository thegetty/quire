/**
 * tocGridItem.spec.js
 *
 * Tests for the `tocGridItem` component
 *
 **/
import { JSDOM } from 'jsdom'
import test from 'ava'
import tocGridItemImage from '../../_includes/components/table-of-contents/item/image.js'

test('Ensure Table of Contents Grid Item Image use thumbnails metadata if available', (t) => {
  // Init the component with an empty config and initialized figure media data hunk
  const imageComponent = tocGridItemImage({ globalData: { config: { figures: {} } } })
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

  // Render out the TOC image, parse it and interrogate the attributes
  const rendered = imageComponent(figureMedia)
  t.not(rendered, '')

  const parsed = JSDOM.fragment(rendered)

  const src = parsed.querySelector('img@src')
  const height = parsed.querySelector('img@height')
  const width = parsed.querySelector('img@width')

  t.is(src, figureMedia.derivatives.thumbnail.paths.internal)
  t.is(height, figureMedia.derivatives.thumbnail.dimensions.height)
  t.is(width, figureMedia.derivatives.thumbnail.dimensions.width)
})
