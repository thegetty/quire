/**
 * figure.spec.js
 *
 * Tests for the `figure` shortcode
 *
 **/
import Figure from '../../_plugins/figures/figure/index.js'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { initEleventyEnvironment } from '../helpers/index.js'
import { JSDOM } from 'jsdom'
import path from 'path'
import test from 'ava'

const iiifConfigPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../_plugins/figures/test/__fixtures__/iiif-config.json')

// Initialize an 11ty environment with figures and other minimal props for figures
test.before('', async (t) => {
  const iiifConfig = JSON.parse(fs.readFileSync(iiifConfigPath))
  const eleventy = await initEleventyEnvironment({})

  t.context.eleventy = eleventy
  t.context.iiifConfig = iiifConfig
})

test('figures with choice annotations should render a canavs-panel element with a choice-id', async (t) => {
  const { eleventy, iiifConfig } = t.context

  const data = {
    id: 'test-choice-annotations',
    label: 'Figure T.C.A',
    caption: 'Figure Test Choice Annotations.',
    credit: '',
    annotations: [
      {
        input: 'radio',
        items: [
          {
            src: 'figures/variant-a.jpg',
            label: 'Variant #1'
          },
          {
            src: 'figures/variant-b.jpg',
            label: 'Variant #2'
          }
        ]
      }
    ]
  }

  // Get the component off the eleventyConfig so intermediate `getFilter()`s resolve
  const figureImage = eleventy.eleventyConfig.config.javascriptFunctions.figureImage

  const figure = new Figure(iiifConfig, null, data)
  const rendered = await figureImage(figure)

  const dom = JSDOM.fragment(rendered)

  const canvasPanel = dom.querySelector('canvas-panel')

  t.truthy(canvasPanel, 'Image should render a canvas-panel element')
  t.truthy(canvasPanel.getAttribute('choice-id'), 'canvas-panel element should have choice-id set')
})

test('figures with choice annotations that are `selected: true` should set the choice-id of the selected annotation', async (t) => {
  const { eleventy, iiifConfig } = t.context

  const data = {
    id: 'test-choice-annotations',
    label: 'Figure T.C.A',
    caption: 'Figure Test Choice Annotations.',
    credit: '',
    annotations: [
      {
        input: 'radio',
        items: [
          {
            src: 'figures/variant-a.jpg',
            label: 'Variant #1'
          },
          {
            src: 'figures/variant-b.jpg',
            label: 'Variant #2',
            selected: true
          }
        ]
      }
    ]
  }

  // Get the component off the eleventyConfig
  const figureImage = eleventy.eleventyConfig.config.javascriptFunctions.figureImage

  // Use the annotation for matching on the test
  const figure = new Figure(iiifConfig, null, data)
  const selected = figure.annotations.flatMap(annotation => annotation.items).find(item => item.selected)
  const rendered = await figureImage(figure)

  const dom = JSDOM.fragment(rendered)

  const canvasPanel = dom.querySelector('canvas-panel')

  t.truthy(canvasPanel, 'Image should render a canvas-panel element')
  t.truthy(canvasPanel.getAttribute('choice-id'), 'canvas-panel element should have choice-id set')
  t.is(canvasPanel.getAttribute('choice-id'), selected.uri)
})
