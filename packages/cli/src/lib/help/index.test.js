import esmock from 'esmock'
import path from 'node:path'
import sinon from 'sinon'
import test from 'ava'

/**
 * Help Topics Library Tests
 *
 * Tests the help topics public API.
 */

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.afterEach.always((t) => {
  t.context.sandbox.restore()
})

test('getTopicList() returns formatted list of topics', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub().resolves(true),
    readdir: sandbox.stub().resolves(['workflows.md', 'debugging.md']),
    readFile: sandbox.stub()
  }

  mockFs.readFile.withArgs(sinon.match(/workflows\.md/), 'utf-8').resolves(`---
title: Common Workflows
description: Step-by-step guides
---
# Workflows`)

  mockFs.readFile.withArgs(sinon.match(/debugging\.md/), 'utf-8').resolves(`---
title: Debugging
description: Troubleshooting help
---
# Debugging`)

  const { getTopicList } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const output = await getTopicList()

  t.true(output.includes('Available help topics:'))
  t.true(output.includes('debugging'))
  t.true(output.includes('Troubleshooting help'))
  t.true(output.includes('workflows'))
  t.true(output.includes('Step-by-step guides'))
  t.true(output.includes('Run "quire help <topic>"'))
})

test('getTopicList() returns message when no topics available', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub().resolves(false)
  }

  const { getTopicList } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const output = await getTopicList()

  t.is(output, 'No help topics available.')
})

test('getTopicList() returns message when topics directory is empty', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub().resolves(true),
    readdir: sandbox.stub().resolves([])
  }

  const { getTopicList } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const output = await getTopicList()

  t.is(output, 'No help topics available.')
})

test('getTopicContent() loads and renders topic', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub().resolves(true),
    readFile: sandbox.stub().resolves('# Test\n\nContent here.')
  }

  const { getTopicContent } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const content = await getTopicContent('test')

  t.is(typeof content, 'string')
  t.true(content.includes('Test'))
  t.true(content.includes('Content here'))
})

test('getTopicContent() strips frontmatter from content', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub().resolves(true),
    readFile: sandbox.stub().resolves(`---
title: Test Topic
description: A test
---
# Test Topic

This is the content.`)
  }

  const { getTopicContent } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const content = await getTopicContent('test')

  t.true(content.includes('Test Topic'))
  t.true(content.includes('This is the content'))
  t.false(content.includes('---'))
  t.false(content.includes('title:'))
})

test('getTopicContent() throws HelpTopicNotFoundError for missing topic', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub()
      .onFirstCall().resolves(false)   // topic file does not exist
      .onSecondCall().resolves(true),  // topics directory exists
    readdir: sandbox.stub().resolves(['epub.md', 'pdf.md', 'debugging.md'])
  }

  const { getTopicContent } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const error = await t.throwsAsync(
    () => getTopicContent('nonexistent'),
    { name: 'HelpTopicNotFoundError' }
  )

  t.is(error.code, 'HELP_TOPIC_NOT_FOUND')
  t.is(error.topic, 'nonexistent')
})

test('getTopicContent() suggests similar topic for typo', async (t) => {
  const { sandbox } = t.context

  const mockFs = {
    pathExists: sandbox.stub()
      .onFirstCall().resolves(false)
      .onSecondCall().resolves(true),
    readdir: sandbox.stub().resolves([
      'configuration.md', 'debugging.md', 'epub.md',
      'pdf.md', 'publishing.md', 'workflows.md'
    ])
  }

  const { getTopicContent } = await esmock('./index.js', {
    'fs-extra': mockFs
  })

  const error = await t.throwsAsync(
    () => getTopicContent('edub'),
    { name: 'HelpTopicNotFoundError' }
  )

  t.is(error.suggestion, 'Did you mean: epub?')
})

test('getTopicsDir() returns the topics directory path', async (t) => {
  const { getTopicsDir } = await import('./index.js')

  const dir = getTopicsDir()

  t.true(dir.endsWith('topics'))
  t.true(dir.includes(`lib${path.sep}help`))
})
