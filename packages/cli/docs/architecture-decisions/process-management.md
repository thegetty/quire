# ADR: Process Management Architecture

**Status:** Accepted
**Date:** 2026-01-16
**Decision Makers:** CLI Team

## Context

The Quire CLI spawns long-running subprocesses (Eleventy dev server, Paged.js printer, PrinceXML) that need graceful shutdown when users press Ctrl-C (SIGINT) or the process receives SIGTERM.

**Problem:** Without centralized process control:
- Subprocesses would be orphaned on signal
- No coordinated cleanup across modules
- Each module would need its own signal handling

## Decision

Implement a centralized **ProcessManager** singleton module (`lib/process/manager.js`) using the **direct import pattern**.

### Architecture

```
bin/cli.js
    └── imports lib/process/manager.js (registers signal handlers)

lib/process/manager.js (singleton)
    ├── Exports: signal, onShutdown(), onShutdownComplete()
    ├── Registers: SIGINT, SIGTERM handlers
    └── Manages: AbortController, cleanup handler registry

lib/11ty/cli.js ─────┐
lib/pdf/prince.js ───┼── import processManager directly
lib/pdf/paged.js ────┘
```

### API

```javascript
import processManager from '#lib/process/manager.js'

// For execa subprocesses - automatic cancellation on signal
execa('prince', args, {
  cancelSignal: processManager.signal,
  gracefulCancel: true
})

// For resources needing explicit cleanup
processManager.onShutdown('pagedjs', () => printer.close())
// ... operation runs ...
processManager.onShutdownComplete('pagedjs')
```

### Key Features

1. **Shared AbortSignal** - Single signal for all execa subprocesses
2. **Cleanup handler registry** - Named handlers with 5-second timeout
3. **Force exit on second signal** - Ctrl-C twice = immediate exit
4. **Centralized logging** - Uses logger abstraction for testability

## Alternatives Considered

### 1. Dependency Injection

```javascript
// Factory pattern
export default (processManager) => ({
  build: async (options) => { /* use injected processManager */ }
})
```

**Rejected because:**
- Adds boilerplate (factory functions, wiring code)
- esmock already provides test isolation
- ProcessManager is a true singleton (one process = one manager)
- Would be inconsistent with existing patterns (paths, logger, config)

### 2. Prop Drilling (Parameter Passing)

```javascript
// Pass signal through call chain
cli.build(options, processManager.signal)
```

**Rejected because:**
- Requires threading through multiple layers
- Inconsistent (PDF modules already imported directly)
- More cognitive overhead tracking parameter flow

### 3. Event Emitter (Pub/Sub)

```javascript
processManager.on('shutdown', () => printer.close())
```

**Rejected because:**
- Harder to trace control flow
- Implicit dependencies
- Over-engineered for this use case

### 4. Convention-based Discovery

```javascript
export default {
  build: async () => { /* ... */ },
  [Symbol.for('quire.cleanup')]: () => printer.close()
}
```

**Rejected because:**
- Requires module registry infrastructure
- More complex than direct import
- Benefits don't justify complexity

### 5. Global/Ambient State

```javascript
process.quireSignal = abortController.signal
```

**Rejected because:**
- Pollutes global process object
- Harder to test (no esmock isolation)
- Implicit coupling

## Consequences

### Positive

- **Simple mental model** - "import what you need"
- **Explicit dependencies** - visible at top of file
- **Testable** - esmock swaps module in tests
- **Consistent** - matches existing codebase patterns
- **Low overhead** - no factories, no wiring code

### Negative

- **Tight coupling to module path** - modules depend on `#lib/process/manager.js`
- **Single implementation** - can't swap ProcessManager at runtime

### Trade-offs Accepted

| Aspect | Trade-off |
|--------|-----------|
| Coupling | Medium coupling acceptable for singleton infrastructure |
| Testability | esmock adequate; true DI not needed |
| Flexibility | Runtime swapping not required |

## Implementation Notes

### Error Handling

1. **Cleanup timeout** - 5 seconds per handler prevents hung shutdowns
2. **Force exit** - Second signal bypasses cleanup
3. **Log level** - Cleanup errors logged as `warn` for visibility

### Files Modified

- `lib/process/manager.js` - New module
- `lib/process/manager.test.js` - Unit tests
- `bin/cli.js` - Import to register handlers
- `lib/11ty/cli.js` - Uses processManager.signal
- `lib/pdf/prince.js` - Uses processManager.signal
- `lib/pdf/paged.js` - Uses onShutdown/onShutdownComplete

## References

- [execa cancelSignal docs](https://github.com/sindresorhus/execa#cancelsignal)
- [Node.js AbortController](https://nodejs.org/api/globals.html#class-abortcontroller)
