import test from 'ava'

import {
  extractFrontmatter,
  stripFrontmatter,
  parseFrontmatter
} from './frontmatter.js'

/**
 * Frontmatter Parsing Tests
 */

// extractFrontmatter tests

test('extractFrontmatter() returns parsed YAML data', (t) => {
  const content = `---
title: Test Topic
description: A test description
---
# Content`

  const result = extractFrontmatter(content)

  t.deepEqual(result, {
    title: 'Test Topic',
    description: 'A test description'
  })
})

test('extractFrontmatter() returns empty object when no frontmatter', (t) => {
  const content = '# Just Content\n\nNo frontmatter here.'

  const result = extractFrontmatter(content)

  t.deepEqual(result, {})
})

test('extractFrontmatter() returns empty object for invalid YAML', (t) => {
  const content = `---
title: [invalid yaml
---
# Content`

  const result = extractFrontmatter(content)

  t.deepEqual(result, {})
})

test('extractFrontmatter() handles values containing colons', (t) => {
  const content = `---
url: https://example.com/path
title: "Part 1: Introduction"
---
# Content`

  const result = extractFrontmatter(content)

  t.is(result.url, 'https://example.com/path')
  t.is(result.title, 'Part 1: Introduction')
})

test('extractFrontmatter() handles arrays and nested objects', (t) => {
  const content = `---
tags:
  - one
  - two
author:
  name: Test
  email: test@example.com
---
# Content`

  const result = extractFrontmatter(content)

  t.deepEqual(result.tags, ['one', 'two'])
  t.deepEqual(result.author, { name: 'Test', email: 'test@example.com' })
})

// stripFrontmatter tests

test('stripFrontmatter() removes frontmatter block', (t) => {
  const content = `---
title: Test
---
# Content

Body text.`

  const result = stripFrontmatter(content)

  t.is(result, '# Content\n\nBody text.')
})

test('stripFrontmatter() returns content unchanged when no frontmatter', (t) => {
  const content = '# Just Content\n\nNo frontmatter.'

  const result = stripFrontmatter(content)

  t.is(result, content)
})

test('stripFrontmatter() handles frontmatter without trailing newline', (t) => {
  const content = `---
title: Test
---# Content`

  const result = stripFrontmatter(content)

  t.is(result, '# Content')
})

// parseFrontmatter tests

test('parseFrontmatter() returns both data and content', (t) => {
  const content = `---
title: Test Topic
description: A description
---
# Heading

Body content.`

  const result = parseFrontmatter(content)

  t.deepEqual(result.data, {
    title: 'Test Topic',
    description: 'A description'
  })
  t.is(result.content, '# Heading\n\nBody content.')
})

test('parseFrontmatter() returns empty data when no frontmatter', (t) => {
  const content = '# Just Content'

  const result = parseFrontmatter(content)

  t.deepEqual(result.data, {})
  t.is(result.content, '# Just Content')
})
