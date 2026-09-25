import esmock from 'esmock'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

const iiifConfigPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../_plugins/figures/test/__fixtures__/iiif-config.json')

test.before(async (t) => {
  const sandbox = sinon.createSandbox()
  const iiifConfig = JSON.parse(fs.readFileSync(iiifConfigPath))

  t.context.iiifConfig = iiifConfig
  t.context.sandbox = sandbox
})

test('processor should call compositor when passed a non-zero `composite` options key', async (t) => {
  const { iiifConfig, sandbox } = t.context

  const composite = sandbox.fake()
  const MockProcessor = await esmock('../../../_plugins/figures/image/processor.js', {
    '../../../_plugins/figures/image/compositor.js': sandbox.stub().returns({
      composite: sandbox.stub().callsFake(composite)
    })
  })

  // Mock the processor and ensure that the compositor gets called correctly for each configuration
  const processor = new MockProcessor(iiifConfig)

  processor.processImages(['test.jpg'], 'destination', { composite: 'grid' })
  t.truthy(
    composite.calledWith(
      sinon.match(['test.jpg']),
      sinon.match('grid'),
      sinon.match.any
    )
  )

  processor.processImages(['test.jpg'], 'destination', { composite: 'overlay' })
  t.truthy(
    composite.calledWith(
      sinon.match(['test.jpg']),
      sinon.match('overlay'),
      sinon.match.any
    )
  )

  // Reset the fake and ensure it is *not* called for composite: false
  composite.resetHistory()

  processor.processImages(['test.jpg'], 'destination', { composite: false })
  t.truthy(
    composite.neverCalledWith(
      sinon.match(['test.jpg']),
      sinon.match.any,
      sinon.match.any
    )
  )
})
