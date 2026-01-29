## CLI lib/PDF Module

This module provides an abstraction to ease PDF generation across PrinceXML and Paged.js. The exported module dynamically loads a wrapper to align the libraries' JS APIs by exporting a single method that accepts a `lib` option and returns an async function that takes input, output, and option params.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      lib/pdf/index.js                       │
│  • Façade: resolves engine, validates prerequisites         │
│  • Checks engine availability (fail-fast before reporter)   │
│  • Owns reporter lifecycle (start/succeed/fail)             │
└─────────────────┬─────────────────────────┬─────────────────┘
                  │                         │
        ┌─────────┴─────────┐     ┌─────────┴─────────┐
        │   paged.js        │     │    prince.js      │
        │   (Paged.js CLI)  │     │   (Prince CLI)    │
        └─────────┬─────────┘     └─────────┬─────────┘
                  │                         │
                  └───────────┬─────────────┘
                              │
                    ┌─────────┴─────────┐
                    │     split.js      │
                    │  (pdf-lib logic)  │
                    └───────────────────┘
```

### Usage

```javascript
import generatePdf from '#lib/pdf/index.js'

// Basic usage (uses project config for output path)
const pdfPath = await generatePdf({ lib: 'pagedjs' })

// With custom output path
const pdfPath = await generatePdf({
  lib: 'prince',
  output: 'downloads/my-book.pdf'  // relative to project root
})

// With absolute path
const pdfPath = await generatePdf({
  lib: 'pagedjs',
  output: '/tmp/publication.pdf'
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lib` | string | `'pagedjs'` | PDF engine: `'pagedjs'` or `'prince'` |
| `output` | string | from config | Output path (overrides project config) |
| `debug` | boolean | `false` | Enable debug output |

### Output Path Resolution

1. If `options.output` is provided, it is used (relative paths resolved against project root)
2. Otherwise, uses `config.pdf.outputDir` + `config.pdf.filename` from project config
3. If no config, falls back to `{projectRoot}/{libName}.pdf`

### Page Mapping

The module also provides plugins for Prince and Paged.js to map quire webpages to PDF pages. In both cases this is achieved after PDF rendering by querying the HTML document that was printed for `.quire-page` elements and using the PDF generator's APIs to determine content page ids, page data like titles and contributors, and first / last pages. They then use a simple stripping algorithm with `pdf-lib` to split the pages for `--page-pdf` flagged runs.

### Paged.js Façade

We use [`pagedjs-cli`](https://gitlab.coko.foundation/pagedjs/pagedjs-cli), which adds a headless to paged.js to facilitate serializing to PDF files.

For more details on the PDF generating API see the [`Paged.js` documentation](https://gitlab.coko.foundation/pagedjs/). See paged.js's [hooks documentation](https://pagedjs.org/documentation/10-handlers-hooks-and-custom-javascript/) for details on the `afterRendered` hook that quire uses to generate the PDF page map.

### Prince XML Façade

The Prince abstraction wraps the command line execution of the Prince executable. 

See the [Prince Command-line Reference](https://www.princexml.com/doc/command-line/). Prince's [scripting documentation](https://www.princexml.com/doc/javascript/) has details on its runtime Javascript implementation, *which is only compatible up to ES5*.

The Prince plugin passes page map data as JSON to STDOUT.

### Test Strategy

The PDF module uses a layered testing approach:

| Layer | Test Type | Coverage |
|-------|-----------|----------|
| `index.js` | Unit tests | Engine resolution, path resolution, availability checks |
| `paged.js` | Integration tests | Error paths (Puppeteer failures, file write errors) |
| `prince.js` | Integration tests | Error paths (Prince failures, cancellation handling) |
| `split.js` | Unit tests | Pure PDF manipulation logic with mocked pdf-lib |
| Full flow | E2E tests | Happy paths with real tools |

#### Why This Strategy?

**Façade (`index.js`)** - Unit tests verify:
- Engine name normalization (`pagedjs`, `paged`, `paged.js` → same engine)
- Output path resolution priority (CLI > config > fallback)
- Engine availability checking (Prince binary in PATH)
- Error handling for missing prerequisites

**Engine implementations (`paged.js`, `prince.js`)** - Integration tests for error paths:
- These are orchestration code that wire external tools (Puppeteer, Prince CLI) with reporter updates
- Happy paths are well-covered by E2E tests with real tools
- Error paths (tool crashes, permission errors, cancellation) are hard to trigger in E2E
- Tests mock `execa`/`pagedjs-cli` to verify error wrapping and cleanup

**PDF splitting (`split.js`)** - Unit tests:
- Pure logic that manipulates PDFs using pdf-lib
- No external tool dependencies
- Tests mock pdf-lib's `PDFDocument` to verify page extraction, cover insertion, and error handling

**E2E tests** - Full integration:
- Test the complete `quire pdf` command with real publications
- Verify actual PDF output with both engines (when available)
- Cover the happy path that unit/integration tests intentionally skip

#### Running Tests

```bash
# All PDF module tests
npm run test:unit -- src/lib/pdf/

# Specific test files
npm run test:unit -- src/lib/pdf/index.test.js    # façade tests
npm run test:unit -- src/lib/pdf/paged.test.js    # Paged.js error paths
npm run test:unit -- src/lib/pdf/prince.test.js   # Prince error paths
npm run test:unit -- src/lib/pdf/split.test.js    # PDF splitting logic
```

### Error Handling

All errors are wrapped in typed `PdfGenerationError` with:
- Tool name (`'Prince'`, `'Paged.js'`)
- Operation that failed (`'PDF rendering'`, `'page map extraction'`, etc.)
- Underlying error details

Example error flow:
```
Prince CLI fails → execa rejects with stderr
  → prince.js catches, wraps in PdfGenerationError
    → index.js catches, calls reporter.fail(), re-throws
      → Command handler displays formatted error to user
```

### Graceful Shutdown

Both engines support Ctrl+C cancellation:
- `prince.js` uses `execa`'s `cancelSignal` option
- `paged.js` registers cleanup with `processManager.onShutdown()`
- On cancellation, `reporter.warn('PDF generation cancelled')` notifies the user
