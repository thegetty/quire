## CLI lib/EPUB Module

This module provides an abstraction for EPUB e-book generation across Epub.js and Pandoc. The exported function accepts a `lib` option and dynamically loads the corresponding engine façade.

### Architecture

```
┌───────────────────────────────────────────────────────────┐
│                lib/epub/index.js (Façade)                 │
│  • Resolve engine (epubjs/pandoc)                         │
│  • Check engine availability (fail-fast)                  │
│  • Resolve output path (CLI > default)                    │
│  • Own reporter lifecycle (start/succeed/fail)            │
│  • Dynamic import of engine implementation                │
└───────────────────────────┬───────────────────────────────┘
                            │
              ┌─────────────┴─────────────────┐
              │     lib/epub/engines.js       │
              │  • Central engine registry    │
              │  • Metadata (name, binary,    │
              │    toolInfo for errors)       │
              └─────────────┬─────────────────┘
                            │
           ┌────────────────┴────────────────────┐
           │                                     │
┌──────────▼───────────┐             ┌───────────▼────────────┐
│  lib/epub/epub.js    │             │  lib/epub/pandoc.js    │
│  • Epub.js wrapper   │             │  • Pandoc CLI wrapper  │
│  • Load manifest     │             │  • Filter XHTML files  │
│  • Generate EPUB     │             │  • Invoke pandoc       │
│  • Write file        │             │  • Write file          │
└──────────────────────┘             └────────────────────────┘
```

### Usage

```javascript
import generateEpub from '#lib/epub/index.js'

// Generate EPUB with Epub.js (default)
const output = await generateEpub({
  lib: 'epubjs',
  output: 'my-book.epub',
  reporter,
})

// Generate EPUB with Pandoc
const output = await generateEpub({
  lib: 'pandoc',
  output: 'my-book.epub',
  reporter,
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lib` | string | `'epubjs'` | Engine to use: `'epubjs'` or `'pandoc'` |
| `output` | string | `'{lib}.epub'` | Output file path |
| `reporter` | object | required | Reporter instance for progress messages |
| `debug` | boolean | `false` | Enable debug output |

### Output Path Resolution

The output path is resolved in priority order:
1. CLI `--output` option value
2. Default: `{lib}.epub` (e.g., `epubjs.epub` or `pandoc.epub`)

Relative paths are resolved against the project root. The `.epub` extension is auto-added if missing.

### Epub.js Façade

Wraps the [`epubjs-cli`](https://github.com/futurepress/epubjs-cli) package for EPUB generation.

**How it works:**
1. Loads `manifest.json` from the build output directory
2. Uses `ManifestToEpub` to generate the EPUB content
3. Writes the generated file to the output path

See the [Epub.js documentation](https://github.com/futurepress/epub.js) for more details.

### Pandoc Façade

Wraps the [Pandoc](https://pandoc.org/) command-line tool for EPUB generation.

**How it works:**
1. Filters XHTML files from the build output
2. Invokes `pandoc` with appropriate options
3. Writes the generated EPUB to the output path

**Requirements:** Pandoc must be installed and available in PATH.

See the [Pandoc documentation](https://pandoc.org/MANUAL.html#creating-epubs-with-pandoc) for EPUB-specific options.

### Engine Availability Check

The façade performs a fail-fast check before starting the reporter:

```javascript
// Runs BEFORE reporter.start()
checkEngineAvailable(engine)  // Throws ToolNotFoundError if binary missing
```

- **Epub.js:** No binary check needed (pure JavaScript)
- **Pandoc:** Checks for `pandoc` in PATH

If the engine is unavailable, a `ToolNotFoundError` is thrown with:
- Install URL for the missing tool
- Fallback suggestion (use default engine)
- Link to documentation

### Error Handling

The module uses typed errors for consistent error handling:

| Error | When Thrown |
|-------|-------------|
| `InvalidEpubLibraryError` | Unknown engine name provided |
| `EpubGenerationError` | Generation fails (with tool/operation context) |
| `ToolNotFoundError` | Required binary not found in PATH |

### Test Strategy

| Component | Test Type | Coverage |
|-----------|-----------|----------|
| `commands/epub.js` | spec + integration | CLI interface, option handling |
| `lib/epub/index.js` | integration | Façade logic, path resolution, engine dispatch |
| `lib/epub/epub.js` | E2E | Happy path via full generation |
| `lib/epub/pandoc.js` | E2E | Happy path via full generation |

The engine implementations (`epub.js`, `pandoc.js`) are thin wrappers with limited logic, so E2E tests provide sufficient coverage. Error path tests would have lower ROI compared to the PDF module's `split.js`.

### Related Documentation

- [EPUB Command](../../commands/epub.js) - CLI command implementation
- [Reporter Pattern](../reporter/README.md) - Progress reporting ownership
- [Error Classes](../../errors/output/) - Typed error definitions
