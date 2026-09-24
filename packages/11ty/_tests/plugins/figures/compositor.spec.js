import Compositor from '../../../_plugins/figures/image/compositor.js'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import sinon from 'sinon'
import test from 'ava'

const iiifConfigPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../_plugins/figures/test/__fixtures__/iiif-config.json')

// Test fixtures and FigureMedia class that avoids real disk calls to sharp
test.before('', async (t) => {
  const iiifConfig = JSON.parse(fs.readFileSync(iiifConfigPath))
  const sandbox = sinon.createSandbox()

  t.context.iiifConfig = iiifConfig
  t.context.sandbox = sandbox
})

// TODO: Add some tests to Layout

test('compositor should correctly overlay images', async (t) => {
  const { iiifConfig } = t.context

  const base = await sharp({
    create: {
      background: { r: 256, g: 256, b: 256, alpha: 1 },
      channels: 4,
      height: 100,
      width: 100
    }
  }).png().toBuffer()

  const layer1 = await sharp({
    create: {
      background: { r: 256, g: 256, b: 256, alpha: 1 },
      channels: 4,
      height: 100,
      width: 100
    }
  }).png().toBuffer()

  const layer2 = await sharp({
    create: {
      background: { r: 256, g: 256, b: 256, alpha: 1 },
      channels: 4,
      height: 100,
      width: 100
    }
  }).png().toBuffer()

  const compositor = new Compositor({ ...iiifConfig, dirs: { ...iiifConfig.dirs, outputRoot: process.cwd() } })
  const outputPath = 'test.jpg'
  const { height, width } = await compositor.composite([base, layer1, layer2], 'overlay', outputPath)

  fs.rmSync(path.join(process.cwd(), outputPath))

  t.deepEqual({ height, width }, { height: 100, width: 100 }, 'composites have the same dimensions as the base image')
  // TODO: Test the overlaid images somehow -- maybe each square is one channel 256 and the total should be white?
})

test('compositor should correctly grid images', async (t) => {
  const { iiifConfig } = t.context

  const item1 = await sharp({
    create: {
      background: { r: 256, g: 256, b: 256, alpha: 1 },
      channels: 4,
      height: 100,
      width: 100
    }
  }).png().toBuffer()

  const item2 = await sharp({
    create: {
      background: { r: 256, g: 256, b: 256, alpha: 1 },
      channels: 4,
      height: 100,
      width: 100
    }
  }).png().toBuffer()

  const item3 = await sharp({
    create: {
      background: { r: 256, g: 256, b: 256, alpha: 1 },
      channels: 4,
      height: 100,
      width: 100
    }
  }).png().toBuffer()

  // Test that 3 same-sized images get composited without error
  const compositor = new Compositor({ ...iiifConfig, dirs: { ...iiifConfig.dirs, outputRoot: process.cwd() } })

  const outputPath = 'test.jpg'
  await compositor.composite([item1, item2, item3], 'grid', outputPath)

  fs.rmSync(path.join(process.cwd(), outputPath))

  // TODO: How to check this was successful?

  t.pass()
})
