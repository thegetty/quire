import test from 'ava'
import { getMimeType, MIME_TYPES, DEFAULT_MIME_TYPE } from './mime-types.js'

/**
 * MIME type tests
 */
test('getMimeType returns correct type for HTML', (t) => {
  t.is(getMimeType('/path/to/file.html'), 'text/html')
})

test('getMimeType returns correct type for CSS', (t) => {
  t.is(getMimeType('/path/to/style.css'), 'text/css')
})

test('getMimeType returns correct type for JavaScript', (t) => {
  t.is(getMimeType('/path/to/script.js'), 'application/javascript')
  t.is(getMimeType('/path/to/module.mjs'), 'application/javascript')
})

test('getMimeType returns correct type for JSON', (t) => {
  t.is(getMimeType('/path/to/data.json'), 'application/json')
})

test('getMimeType returns correct type for XML', (t) => {
  t.is(getMimeType('/path/to/feed.xml'), 'application/xml')
})

test('getMimeType returns correct type for images', (t) => {
  t.is(getMimeType('/path/to/image.png'), 'image/png')
  t.is(getMimeType('/path/to/image.jpg'), 'image/jpeg')
  t.is(getMimeType('/path/to/image.jpeg'), 'image/jpeg')
  t.is(getMimeType('/path/to/image.gif'), 'image/gif')
  t.is(getMimeType('/path/to/image.svg'), 'image/svg+xml')
  t.is(getMimeType('/path/to/image.webp'), 'image/webp')
  t.is(getMimeType('/path/to/favicon.ico'), 'image/x-icon')
  t.is(getMimeType('/path/to/image.avif'), 'image/avif')
})

test('getMimeType returns correct type for fonts', (t) => {
  t.is(getMimeType('/path/to/font.woff'), 'font/woff')
  t.is(getMimeType('/path/to/font.woff2'), 'font/woff2')
  t.is(getMimeType('/path/to/font.ttf'), 'font/ttf')
  t.is(getMimeType('/path/to/font.otf'), 'font/otf')
  t.is(getMimeType('/path/to/font.eot'), 'application/vnd.ms-fontobject')
})

test('getMimeType returns correct type for documents', (t) => {
  t.is(getMimeType('/path/to/doc.pdf'), 'application/pdf')
  t.is(getMimeType('/path/to/book.epub'), 'application/epub+zip')
})

test('getMimeType returns correct type for media', (t) => {
  t.is(getMimeType('/path/to/audio.mp3'), 'audio/mpeg')
  t.is(getMimeType('/path/to/video.mp4'), 'video/mp4')
  t.is(getMimeType('/path/to/video.webm'), 'video/webm')
  t.is(getMimeType('/path/to/audio.ogg'), 'audio/ogg')
  t.is(getMimeType('/path/to/audio.wav'), 'audio/wav')
})

test('getMimeType returns DEFAULT_MIME_TYPE for unknown extensions', (t) => {
  t.is(getMimeType('/path/to/file.xyz'), DEFAULT_MIME_TYPE)
  t.is(getMimeType('/path/to/file'), DEFAULT_MIME_TYPE)
  t.is(getMimeType('/path/to/.hidden'), DEFAULT_MIME_TYPE)
})

test('getMimeType is case insensitive', (t) => {
  t.is(getMimeType('/path/to/file.HTML'), 'text/html')
  t.is(getMimeType('/path/to/file.CSS'), 'text/css')
  t.is(getMimeType('/path/to/file.JS'), 'application/javascript')
  t.is(getMimeType('/path/to/file.PNG'), 'image/png')
})

/**
 * MIME_TYPES constant tests
 */
test('MIME_TYPES includes common web file types', (t) => {
  t.true('.html' in MIME_TYPES)
  t.true('.css' in MIME_TYPES)
  t.true('.js' in MIME_TYPES)
  t.true('.json' in MIME_TYPES)
  t.true('.png' in MIME_TYPES)
  t.true('.jpg' in MIME_TYPES)
  t.true('.svg' in MIME_TYPES)
  t.true('.woff2' in MIME_TYPES)
  t.true('.pdf' in MIME_TYPES)
})

test('MIME_TYPES values are valid MIME type strings', (t) => {
  for (const [ext, mimeType] of Object.entries(MIME_TYPES)) {
    t.regex(mimeType, /^[a-z]+\/[a-z0-9.+-]+$/, `${ext} should have valid MIME type`)
  }
})

/**
 * DEFAULT_MIME_TYPE constant tests
 */
test('DEFAULT_MIME_TYPE is application/octet-stream', (t) => {
  t.is(DEFAULT_MIME_TYPE, 'application/octet-stream')
})
