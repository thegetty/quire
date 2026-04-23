/**
 * figures.spec.js
 *
 * Tests for the `figures` plugin
 *
 **/
// import FigureFactory from '../../_plugins/figures/figure/factory.js'
import test from 'ava'
// import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { initEleventyEnvironment } from '../helpers/index.js'
// import { JSDOM } from 'jsdom'
// import path from 'path'

// Initialize a minimal FigureFactory
test.before('', async (t) => {
  // const factory = new FigureFactory()

  // t.context.factory = factory
})

test('FigureFactory should create a staticInlineFigureImage for all figures', async (t) => {
  // TODO: Mock sharp().metadata() to return height: 100, width: 100
  // TODO: Mock sharp().extract().resize().withMetadata().toFile(x)

  // TODO: Given a figure with zoom: true, `staticInlineFigureImage` should be populated and the mock for sharp should be called
  // TODO: Given a figure without zoom: true, `staticInlineFigureImage` should be populated and the mock for sharp should be called
  t.fail('Spec staticInlineFigureImage test')
})
