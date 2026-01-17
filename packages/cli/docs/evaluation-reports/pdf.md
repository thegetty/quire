# PDF Command & lib/pdf Architecture Evaluation

**Date:** 2026-01-21
**Branch:** `test/cli-command-specs`
**Status:** Post-refactor evaluation

## Overall Ratings

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Architecture** | ⭐⭐⭐⭐ (4/5) | Clean façade pattern, clear separation of concerns |
| **UX** | ⭐⭐⭐⭐ (4/5) | Good CLI options, clear feedback, `--build` convenience |
| **Error Handling** | ⭐⭐⭐⭐ (4/5) | Typed errors with suggestions, fail-fast validation |
| **Test Coverage** | ⭐⭐⭐⭐ (4/5) | Good command/façade coverage, split.js unit tests, E2E covers engines |
| **Documentation** | ⭐⭐⭐⭐ (4/5) | README, JSDoc, ownership patterns documented |

## What's Working Well

### 1. Clean Ownership Pattern

- Command configures reporter, façade owns lifecycle
- No duplicate messages, clear responsibility boundaries
- Well-documented in reporter README

### 2. Typed Error Handling

- `MissingBuildOutputError` - clear prerequisite failure
- `InvalidPdfLibraryError` - invalid engine choice
- `PdfGenerationError` - granular operation failures with tool/operation context

### 3. Progressive Output Path Resolution

- CLI `--output` > project config > fallback (`{lib}.pdf`)
- Relative paths resolved against project root
- Absolute paths honored

### 4. Deprecated Option Handling

- `--lib` aliased to `--engine` with hidden flag
- Backwards compatible, no breaking change

### 5. Convenience Features

- `--build` flag to build-then-generate
- `--open` to launch PDF viewer
- `--verbose`/`--quiet`/`--debug` modes

## High-Impact Gaps (Priority Order)

### 1. ~~Missing Prince Availability Check~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| High | Low | User hits cryptic error |

**Problem:** Users selecting `--engine prince` got an unhelpful error when Prince wasn't installed.

**Solution implemented:**
1. Added `checkEngineAvailable()` in `lib/pdf/index.js` façade that runs BEFORE the reporter starts
2. Engine definitions now include `requiresBinary` and `toolInfo` metadata
3. `ToolNotFoundError` accepts tool metadata as constructor parameter (façade owns the knowledge)
4. Removed redundant `which` call from `prince.js` (façade now handles this)

**Architecture note:** Tool metadata (install URLs, fallback suggestions) is owned by the façade that uses the tool, not the error class. This keeps domain knowledge where it belongs.

**New behavior:**
```
$ quire pdf --engine prince
Error: PrinceXML is not installed or not in PATH
  Suggestion: Install PrinceXML from https://www.princexml.com/download/
  Or use the default PDF engine: quire pdf --engine pagedjs
```

**Tests added:**
- `generatePdf throws ToolNotFoundError when prince is not in PATH`
- `generatePdf does not check binary for pagedjs (built-in engine)`
- `generatePdf succeeds when prince is in PATH`

---

### 2. ~~No Tests for Implementation Modules~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| High | Medium | Regressions in PDF generation |

**Problem:** Only `lib/pdf/index.test.js` existed (14 tests). The actual PDF generation implementations (`paged.js`, `prince.js`, `split.js`) had no tests.

**Analysis:** After evaluation, we determined:
- `paged.js` and `prince.js` are **orchestration code** - happy paths are well-covered by E2E
- However, **error paths are difficult to trigger in E2E** (tool crashes, permission errors, cancellation)
- `split.js` contains **pure logic** (PDF manipulation with pdf-lib) that benefits from unit tests

**Solution implemented:**
- Added comprehensive unit tests for `split.js` (16 tests)
- Added integration tests for `paged.js` error paths (7 tests)
- Added integration tests for `prince.js` error paths (6 tests)

**Current test coverage:**
- `commands/pdf.js` - 11 tests ✅
- `lib/pdf/index.js` - 16 tests ✅
- `lib/pdf/paged.js` - 7 tests ✅ (error paths)
- `lib/pdf/prince.js` - 6 tests ✅ (error paths)
- `lib/pdf/split.js` - 16 tests ✅

**`paged.js` tests cover:**
- PDF rendering failure (Puppeteer crash)
- Page map extraction failure (browser context destroyed)
- Cover PDF rendering failure
- Cover page map extraction failure
- PDF file write failure (permission denied)
- Printer lifecycle (close on success, keep open in debug mode)

**`prince.js` tests cover:**
- Page map generation failure (Prince error)
- PDF printing failure
- Cover page map generation failure
- Output directory creation failure (permission denied)
- Graceful cancellation (Ctrl+C handling)

**`split.js` tests cover:**
- Basic behavior (null/undefined config, empty pageMap)
- Section extraction (single, multiple, prefix stripping, page removal)
- Cover page handling (insertion, negative/undefined edge cases)
- Error handling (main PDF load, covers PDF load, section extraction failures)
- Output path construction

---

### 3. ~~Inconsistent Progress Phase Order~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| Medium | Low | Confusing UX |

**Problem:** `paged.js` and `prince.js` had different phase orders, and Prince's first phase "Generating page map" was misleading because it actually renders a full PDF just to extract page info.

**Solution implemented:**
1. Renamed Prince's first phase from "Generating page map..." to "Analyzing document structure..." to clarify it's a preparatory step, not the final render
2. Renamed Paged.js's "Generating page map..." to "Extracting page map..." to clarify it extracts from the already-rendered PDF

**Updated phase names:**

| Phase | paged.js | prince.js |
|-------|----------|-----------|
| 1 | Rendering PDF... | Analyzing document structure... |
| 2 | Extracting page map... | Rendering cover pages... |
| 3 | Rendering cover pages... | Rendering PDF... |
| 4 | Writing PDF files... | Writing PDF files... |

**Design note:** The phase orders are inherently different because the engines work differently:
- **Paged.js**: Renders PDF first, then extracts page map from the browser context
- **Prince**: Must render with a script to extract page info, then renders again without it

Using accurate, descriptive phase names is better than forcing identical phases that would misrepresent what's happening.

---

### 4. No Engine Availability Validation at Command Level ⚠️ MEDIUM PRIORITY

| Impact | Effort | Risk |
|--------|--------|------|
| Medium | Low | Late failure |

**Problem:** If Prince isn't available, the error occurs deep in the façade. The command could check availability upfront.

**Current flow:**
```
pdf.js → generatePdf() → prince.js → which('prince') → Error
```

**Better flow:**
```
pdf.js → checkEngineAvailable(engine) → Error (early, with suggestion)
```

**Fix:** Add optional `checkEngineAvailable()` in façade that commands can call for early validation.

---

### 5. ~~Silent Failure on Graceful Shutdown~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| Low | Low | Confusing when Ctrl+C |

**Problem:** In `prince.js`, when operations were cancelled via Ctrl+C, the function returned silently without any indication to the user.

**Solution implemented:** Added `reporter.warn('PDF generation cancelled')` before returning in all three cancellation handlers:
- Document structure analysis cancellation
- Cover page rendering cancellation
- PDF rendering cancellation

---

### 6. ~~Unused `stdout`/`stderror` Variables~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| Low | Trivial | Code smell |

**Problem:** `prince.js` captured `stderror` and `stdout` from execa but never used them.

**Solution implemented:** Removed unused destructuring - the execa call now doesn't capture output since it's not needed.

---

## Recommendations Summary

| Priority | Gap | Effort | Status |
|----------|-----|--------|--------|
| ✅ ~~HIGH~~ | ~~Prince availability check~~ | Low | **RESOLVED** - Added `checkEngineAvailable()` in façade |
| ✅ ~~HIGH~~ | ~~Missing implementation tests~~ | Medium | **RESOLVED** - Added split.js tests, E2E covers engines |
| ✅ ~~MEDIUM~~ | ~~Inconsistent progress phases~~ | Low | **RESOLVED** - Renamed to accurate, descriptive phase names |
| ✅ ~~MEDIUM~~ | ~~Late engine validation~~ | Low | **RESOLVED** - Check happens before reporter starts |
| ✅ ~~LOW~~ | ~~Silent cancellation~~ | Low | **RESOLVED** - Added `reporter.warn()` on Ctrl+C |
| ✅ ~~LOW~~ | ~~Unused variables~~ | Trivial | **RESOLVED** - Removed unused destructuring |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        commands/pdf.js                               │
│  • configure reporter                                                │
│  • handle --build (optional pre-phase)                              │
│  • delegate to façade                                                │
│  • handle --open                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        lib/pdf/index.js                              │
│  • resolve library (pagedjs/prince)                                 │
│  • check engine availability (fail fast)                            │
│  • validate prerequisites (pdf.html exists)                         │
│  • resolve output path (CLI > config > fallback)                    │
│  • own reporter lifecycle (start/succeed/fail)                      │
│  • dynamic import implementation                                     │
└───────────────┬─────────────────────────────────┬───────────────────┘
                │                                 │
                │     ┌───────────────────┐       │
                │     │ lib/pdf/engines.js │       │
                │     │  • engine registry │       │
                │     │  • metadata (name, │       │
                │     │    binary, toolInfo)│      │
                │     └─────────┬─────────┘       │
                │               │                 │
                ▼               ▼                 ▼
┌───────────────────────────┐     ┌───────────────────────────────────┐
│     lib/pdf/paged.js      │     │        lib/pdf/prince.js          │
│  • re-export metadata     │     │  • re-export metadata             │
│  • configure Printer      │     │  • generate page map              │
│  • render PDF             │     │  • render covers                  │
│  • extract page map       │     │  • render PDF                     │
│  • render covers          │     │  • split & write files            │
│  • write files            │     │  • reporter.update()              │
│  • reporter.update()      │     │                                   │
└───────────────┬───────────┘     └───────────────┬───────────────────┘
                │                                 │
                └────────────────┬────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   lib/pdf/split.js     │
                    │  • parse PDF           │
                    │  • split by page map   │
                    │  • add cover pages     │
                    └────────────────────────┘
```

## Key Files

| File | Purpose | Tests |
|------|---------|-------|
| `commands/pdf.js` | CLI command, options, pre-phase handling | 11 tests ✅ |
| `lib/pdf/index.js` | Façade, validation, path resolution, engine availability | 16 tests ✅ |
| `lib/pdf/engines.js` | Central engine registry (metadata, binary requirements) | N/A |
| `lib/pdf/paged.js` | Paged.js implementation | 7 tests ✅ |
| `lib/pdf/prince.js` | PrinceXML implementation | 6 tests ✅ |
| `lib/pdf/split.js` | PDF splitting utility | 16 tests ✅ |
| `lib/pdf/README.md` | Module documentation | N/A |
| `errors/output/tool-not-found-error.js` | Generic error for missing CLI tools | N/A |
| `errors/output/pdf-generation-error.js` | Typed error class | N/A |
| `errors/output/missing-build-output-error.js` | Typed error class | N/A |
| `errors/output/invalid-pdf-library-error.js` | Typed error class | N/A |

## Related Documentation

- [Reporter Ownership Pattern](../src/lib/reporter/README.md#ownership-pattern)
- [Doctor Stateless vs Stateful](../src/lib/doctor/README.md#stateless-diagnostics-vs-stateful-validation)
- [CLI Workflows - PDF](./workflows.md#generating-pdf)
