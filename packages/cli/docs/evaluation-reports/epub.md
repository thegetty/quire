# EPUB Command & lib/epub Architecture Evaluation

**Date:** 2026-01-21
**Branch:** `feature/epub-output-option`
**Status:** Post-refactor evaluation (aligned with lib/pdf architecture)

## Overall Ratings

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Architecture** | ⭐⭐⭐⭐ (4/5) | Clean façade pattern, mirrors PDF architecture |
| **UX** | ⭐⭐⭐⭐ (4/5) | Good CLI options, `--build` convenience, `--open` support |
| **Error Handling** | ⭐⭐⭐⭐ (4/5) | Typed errors with suggestions, fail-fast validation |
| **Test Coverage** | ⭐⭐⭐⭐ (4/5) | Good command/façade coverage (1022 lines across 3 files) |
| **Documentation** | ⭐⭐⭐⭐ (4/5) | README added for lib/epub module |

## What's Working Well

### 1. Clean Ownership Pattern

- Command configures reporter, façade owns lifecycle
- No duplicate messages, clear responsibility boundaries
- Mirrors the established PDF pattern
- Command delegates all reporter calls to façade

### 2. Typed Error Handling

- `InvalidEpubLibraryError` - invalid engine choice
- `EpubGenerationError` - granular operation failures with tool/operation context
- `ToolNotFoundError` - with rich metadata (install URL, fallback suggestion)
- `MissingBuildOutputError` - when build output is missing

### 3. Engine Availability Check (fail-fast)

- `checkEngineAvailable()` runs BEFORE reporter starts
- Clean error with install instructions when Pandoc is missing
- Built-in engines (epubjs) skip binary check

### 4. Progressive Output Path Resolution

- CLI `--output` > default (`{libName}.epub`)
- Relative paths resolved against project root
- Auto-adds `.epub` extension if missing

### 5. Deprecated Option Handling

- `--lib` aliased to `--engine` with hidden flag
- Backwards compatible, no breaking change

### 6. Convenience Features

- `--build` flag to build-then-generate
- `--open` to launch EPUB viewer
- `--verbose`/`--quiet`/`--debug` modes

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        commands/epub.js                              │
│  • configure reporter                                                │
│  • handle --build (optional pre-phase)                              │
│  • delegate to façade                                                │
│  • handle --open                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        lib/epub/index.js                             │
│  • resolve library (epubjs/pandoc)                                  │
│  • check engine availability (fail fast)                            │
│  • resolve output path (CLI > default)                              │
│  • own reporter lifecycle (start/succeed/fail)                      │
│  • dynamic import implementation                                     │
└───────────────┬─────────────────────────────────┬───────────────────┘
                │                                 │
                │     ┌───────────────────┐       │
                │     │ lib/epub/engines.js│       │
                │     │  • engine registry │       │
                │     │  • metadata (name, │       │
                │     │    binary, toolInfo)│      │
                │     └─────────┬─────────┘       │
                │               │                 │
                ▼               ▼                 ▼
┌───────────────────────────┐     ┌───────────────────────────────────┐
│     lib/epub/epub.js      │     │        lib/epub/pandoc.js         │
│  • re-export metadata     │     │  • re-export metadata             │
│  • load manifest          │     │  • filter XHTML files             │
│  • generate EPUB          │     │  • invoke pandoc CLI              │
│  • write file             │     │  • write file                     │
└───────────────────────────┘     └───────────────────────────────────┘
```

## Gaps Identified

### 1. ~~Missing lib/epub README~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| Medium | Low | Maintainability |

**Problem:** Unlike lib/pdf, the lib/epub module has no README documenting its architecture, test strategy, or usage.

**Resolution:** Created `lib/epub/README.md` with comprehensive documentation including architecture diagram, usage examples, error handling, and test strategy.

---

### 2. No Integration Tests for Engine Implementations ⚠️ LOW PRIORITY

| Impact | Effort | Risk |
|--------|--------|------|
| Low | Medium | Error path regressions |

**Problem:** `epub.js` and `pandoc.js` have no dedicated tests for error paths.

**Current coverage:**
- `commands/epub.js` - spec + integration tests ✅
- `lib/epub/index.js` - 14 tests ✅
- `lib/epub/epub.js` - 0 tests (happy path covered by E2E)
- `lib/epub/pandoc.js` - 0 tests (happy path covered by E2E)

**Analysis:** Unlike PDF (which has split.js for complex logic), EPUB engines are thin wrappers:
- `epub.js` wraps `epubjs-cli` with error handling
- `pandoc.js` wraps `pandoc` CLI with error handling

E2E tests provide reasonable coverage. Error path tests would have lower ROI than for PDF.

**Recommendation:** Consider adding error path tests if bugs emerge, but not a priority.

---

### 3. ~~Duplicate Reporter Calls~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| Low | Low | Minor UX issue |

**Problem:** Both command and façade call reporter methods, potentially causing duplicate messages.

**Resolution:** Removed `reporter.start()`, `reporter.succeed()`, and `reporter.fail()` calls from `commands/epub.js`. The façade now owns the entire reporter lifecycle, matching the documented pattern.

---

### 4. ~~Missing Build Output Error Not Typed~~ ✅ RESOLVED

| Impact | Effort | Risk |
|--------|--------|------|
| Low | Low | Inconsistent error handling |

**Problem:** When build output is missing, a plain Error is thrown instead of a typed error.

**Resolution:** Now uses `MissingBuildOutputError` (reused from PDF) for consistency with the error handling pattern. Error code changed from `ENOBUILD` to `BUILD_OUTPUT_MISSING`.

---

## Recommendations Summary

| Priority | Gap | Effort | Status |
|----------|-----|--------|--------|
| ~~⚠️ MEDIUM~~ | ~~Missing lib/epub README~~ | Low | ✅ RESOLVED |
| ⚠️ LOW | No engine implementation tests | Medium | Deferred |
| ~~⚠️ LOW~~ | ~~Duplicate reporter calls~~ | Low | ✅ RESOLVED |
| ~~⚠️ LOW~~ | ~~Missing build output not typed~~ | Low | ✅ RESOLVED |

## Key Files

| File | Purpose | Tests |
|------|---------|-------|
| `commands/epub.js` | CLI command, options, pre-phase handling | spec + integration ✅ |
| `lib/epub/index.js` | Façade, validation, path resolution, engine availability | 14 tests ✅ |
| `lib/epub/engines.js` | Central engine registry (metadata, binary requirements) | N/A |
| `lib/epub/epub.js` | Epub.js implementation | E2E coverage |
| `lib/epub/pandoc.js` | Pandoc implementation | E2E coverage |
| `errors/output/epub-generation-error.js` | Typed error class | N/A |
| `errors/output/invalid-epub-library-error.js` | Typed error class | N/A |

## Test Coverage Details

| Test File | Line Count | Tests |
|-----------|------------|-------|
| `commands/epub.spec.js` | 114 | Command contract/interface |
| `commands/epub.test.js` | 401 | Command integration |
| `lib/epub/index.test.js` | 507 | Façade integration |
| **Total** | **1,022** | |

## Comparison with lib/pdf

| Aspect | lib/pdf | lib/epub |
|--------|---------|----------|
| Architecture | Façade + engines + split | Façade + engines |
| Engine registry | `engines.js` ✅ | `engines.js` ✅ |
| Availability check | `checkEngineAvailable()` ✅ | `checkEngineAvailable()` ✅ |
| README | Comprehensive ✅ | Comprehensive ✅ |
| Error handling | `PdfGenerationError` ✅ | `EpubGenerationError` ✅ |
| Split logic | `split.js` (16 tests) | N/A |
| Engine tests | paged.js (7), prince.js (6) | None |

## Related Documentation

- [Reporter Ownership Pattern](../src/lib/reporter/README.md#ownership-pattern)
- [PDF Architecture Evaluation](./pdf-architecture-evaluation.md)
- [CLI Workflows - EPUB](./workflows.md#generating-epub)
