# Pull Request Merge Strategy for quire-cli@1.0.0 Release

## Executive Summary

This document analyzes the 10 open pull requests targeting the quire-cli@1.0.0 release, identifies their dependencies and stacking relationships, and provides a merge strategy with specific git commands.

---

## Pull Request Dependency Analysis

### PR Stack Diagram

```
                                    main
                                      │
               ┌──────────────────────┼──────────────────────┐
               │                      │                      │
               ▼                      ▼                      ▼
         #1143 (errors)         #1146 (debug)          #1148 (process)
               │                      │                      │
               │                      ▼                      │
               │               #1147 (docs)                  │
               │                      │                      │
               │              ┌───────┴───────┐              │
               │              │               │              │
               │              ▼               │              │
               │         #1149 (log)          │              │
               │              │               │              │
               │              ▼               │              │
               │         #1150 (UX) ◄─────────┤              │
               │              │               │              │
               │    ┌─────────┼─────────┐     │              │
               │    │         │         │     │              │
               │    ▼         ▼         ▼     │              │
               │ #1151    #1152      (other)  │              │
               │ (engine) (doctor)            │              │
               │              │               │              │
               │              ▼               │              │
               │         #1153 (reporter)     │              │
               │              │               │              │
               │              ▼               │              │
               │         #1154 (output modes) │              │
               │                              │              │
               └──────────────────────────────┴──────────────┘
```

### Stacking Relationships

| PR # | Title | Source Branch | Target Branch | Depends On |
|------|-------|---------------|---------------|------------|
| #1143 | Refactored Quire CLI Errors | `refactor/cli-errors` | `main` | #1144 (merged) |
| #1144 | Refactor CLI Logger | `refactor/cli-logger` | _merged_ | n/a |
| #1145 | Docs: cross-platform tests | `docs/cross-platform-tests` | _merged_ | n/a |
| #1146 | Feature: logger debug module | `feature/debug-logger` | `main` | #1144 (merged) |
| #1147 | Docs: development guidelines | `docs/development-guidelines` | `feature/debug-logger` | #1146 |
| #1148 | Fix: cli process control | `fix/process-control` | `main` | None |
| #1149 | Feature: refined log output | `feature/log-output-refined` | `feature/debug-logger` | #1146 |
| #1150 | Feature: cli UX improvements | `feature/cli-ux-improvements` | `feature/log-output-refined` | #1149 |
| #1151 | Config: pdfEngine/epubEngine | `feature/cli-engine-config` | `feature/cli-ux-improvements` | #1150 |
| #1152 | Feature: quire doctor command | `feature/cli-doctor-command` | `feature/cli-ux-improvements` | #1150 |
| #1153 | Feature: lib/reporter module | `feature/lib-reporter` | `feature/cli-doctor-command` | #1152 |
| #1154 | Refactor: cli output modes | `refactor/cli-output-modes` | `feature/lib-reporter` | #1153 |

---

| PR # | Branch | Base |
|------|--------|------|
| #1149 | `feature/log-output-refined` | `main` |
| #1150 | `feature/cli-ux-improvements` | `feature/log-output-refined` |
| #1151 | `feature/cli-engine-config` | `feature/cli-ux-improvements` |
| #1152 | `feature/cli-doctor-command` | `feature/cli-ux-improvements` |
| #1153 | `feature/lib-reporter` | `feature/cli-doctor-command` |
| #1154 | `refactor/cli-output-modes` | `feature/lib-reporter` |
| #1158 | `feature/pdf-output-option` | `refactor/cli-output-modes` |
| #1159 | `feature/epub-output-option` | `refactor/cli-output-modes` |
| #1162 | `feature/help-topics` | `feature/cli-ux-improvements` |

## Findings

### 1. Two Independent Merge Chains

The PRs form two independent chains that can be merged in parallel:

**Chain A: Error Handling (Independent)**
- #1143 → main

**Chain B: CLI Features (Stacked)**
- #1146 → main
- #1147 → #1146
- #1149 → #1146
- #1150 → #1149
- #1151 → #1150
- #1152 → #1150
- #1153 → #1152
- #1154 → #1153

**Chain C: Process Control (Independent)**
- #1148 → main

### 2. Integration Status of Custom Errors (#1143)

The custom error system from #1143 is **NOT yet integrated** into the subsequent PR branches. Review of the stacked branches shows:

- `feature/debug-logger` (#1146) does not include error handling refactoring
- `feature/log-output-refined` (#1149) does not throw custom errors
- `feature/cli-ux-improvements` (#1150) does not use custom error classes
- `feature/cli-doctor-command` (#1152) implements its own error handling
- `feature/lib-reporter` (#1153) does not leverage centralized error handling

**Recommendation**: After merging #1143, subsequent branches should be rebased or have custom errors cherry-picked to ensure consistent error handling across all new features.

### 3. Feature/Refactor Branch Conflicts

The following branches may have merge conflicts due to overlapping changes:

| Files | Conflicting PRs |
|-------|-----------------|
| `src/main.js` | #1143, #1146, #1149, #1150, #1154 |
| `src/commands/*.js` | #1143, #1149, #1150, #1152, #1153, #1154 |
| `lib/logger/*.js` | #1146, #1147, #1149 |
| `lib/config/*.js` | #1149, #1150, #1151 |

### 4. Test Coverage Gaps

- #1148 (process control) has tests but they're specific to 11ty façade
- #1151 (engine config) needs integration tests for config→command flow
- Integration between reporter (#1153) and error handling (#1143) is untested

---

## Recommended Merge Strategy

### Strategy: Sequential Merge with Intermediate Rebases

Given the deep stacking and potential conflicts, the recommended approach is:

1. **Merge independent PRs first** (parallel safe)
2. **Merge main stack sequentially** (respecting dependencies)
3. **Rebase after each merge** to maintain clean history
4. **Create integration branch** for final validation

### Phase 1: Merge Independent PRs to Main ✅

```bash
# Step 1: Merge process control fix
git checkout main
git pull origin main
git merge --no-ff origin/fix/process-control -m "Merge #1148: Fix cli process control"
git push origin main

# Step 2: Merge custom errors refactor
git merge --no-ff origin/refactor/cli-errors -m "Merge #1143: Refactored Quire CLI Errors"
git push origin main
```

### Phase 2: Merge Logger Stack to Main ✅

```bash
# Step 3: Merge debug logger feature
git checkout main
git pull origin main
git merge --no-ff origin/feature/debug-logger -m "Merge #1146: Feature: logger debug module"
git push origin main

# Step 4: Update development docs branch and merge
git checkout docs/development-guidelines
git rebase main
# Resolve any conflicts
git push origin docs/development-guidelines --force-with-lease
git checkout main
git merge --no-ff origin/docs/development-guidelines -m "Merge #1147: Docs: development guidelines"
git push origin main
```

### Phase 3: Merge Log Output and UX Stack

```bash
# Step 5: Update log-output-refined branch
git checkout feature/log-output-refined
git rebase main
# Resolve conflicts in lib/logger, commands
git push origin feature/log-output-refined --force-with-lease

# Step 6: Merge refined log output
git checkout main
git merge --no-ff origin/feature/log-output-refined -m "Merge #1149: Feature: refined log output"
git push origin main

# Step 7: Update UX improvements branch
git checkout feature/cli-ux-improvements
git rebase main
# Resolve conflicts in commands, main.js
git push origin feature/cli-ux-improvements --force-with-lease

# Step 8: Merge UX improvements
git checkout main
git merge --no-ff origin/feature/cli-ux-improvements -m "Merge #1150: Feature: cli UX improvements"
git push origin main
```

### Phase 4: Merge Engine Config (Parallel Branch)

```bash
# Step 9: Update engine config branch
git checkout feature/cli-engine-config
git rebase main
# Resolve conflicts
git push origin feature/cli-engine-config --force-with-lease

# Step 10: Merge engine config
git checkout main
git merge --no-ff origin/feature/cli-engine-config -m "Merge #1151: Add config settings for pdfEngine/epubEngine"
git push origin main
```

### Phase 5: Merge Doctor Command Stack

```bash
# Step 11: Update doctor command branch
git checkout feature/cli-doctor-command
git rebase main
# Resolve conflicts in commands, lib/doctor
git push origin feature/cli-doctor-command --force-with-lease

# Step 12: Merge doctor command
git checkout main
git merge --no-ff origin/feature/cli-doctor-command -m "Merge #1152: Feature: quire doctor command"
git push origin main

# Step 13: Update lib-reporter branch
git checkout feature/lib-reporter
git rebase main
# Resolve conflicts
git push origin feature/lib-reporter --force-with-lease

# Step 14: Merge reporter module
git checkout main
git merge --no-ff origin/feature/lib-reporter -m "Merge #1153: Feature: command progress indicators"
git push origin main

# Step 15: Update output modes branch
git checkout refactor/cli-output-modes
git rebase main
# Resolve conflicts in commands, main.js
git push origin refactor/cli-output-modes --force-with-lease

# Step 16: Merge output modes refactor
git checkout main
git merge --no-ff origin/refactor/cli-output-modes -m "Merge #1154: Refactor: cli output modes"
git push origin main
```

### Phase 6: Final Validation

```bash
# Step 17: Run full test suite
npm test

# Step 18: Run integration tests
npm run test:integration

# Step 19: Verify CLI functionality
npx quire --help
npx quire doctor
npx quire build --help

# Step 20: Tag release candidate
git tag -a v1.0.0-rc.34 -m "Release candidate for quire-cli@1.0.0"
git push origin v1.0.0-rc.34
```

---

## Merge Order Summary

| Order | PR # | Branch | Description |
|-------|------|--------|-------------|
| 1 | #1148 | fix/process-control | Graceful shutdown for subprocesses |
| 2 | #1143 | refactor/cli-errors | Centralized error handling |
| 3 | #1146 | feature/debug-logger | Debug namespace logging |
| 4 | #1147 | docs/development-guidelines | Development documentation |
| 5 | #1149 | feature/log-output-refined | Logger refinements |
| 6 | #1150 | feature/cli-ux-improvements | UX improvements |
| 7 | #1151 | feature/cli-engine-config | Engine configuration |
| 8 | #1152 | feature/cli-doctor-command | Doctor diagnostic command |
| 9 | #1153 | feature/lib-reporter | Progress reporter module |
| 10 | #1154 | refactor/cli-output-modes | Output mode standardization |

---

## Combined Changes Summary by Audience

### For Non-Technical Users (Editors)

**New Commands:**
- `quire doctor` - Diagnose issues with your Quire environment and project
- `quire help workflows` - View common workflow documentation

**Improved Commands:**
- `quire serve` - New alias for `quire preview`
- `quire settings` - Renamed from `quire conf` for clarity
- `quire pdf --build` - Automatically run build before PDF generation
- `quire epub --build` - Automatically run build before EPUB generation

**Better Feedback:**
- Progress spinners during long-running operations
- Clear success/failure messages
- Elapsed time display for builds

**Help Improvements:**
- Documentation links in every command's help text
- Clearer command summaries
- Example usage for all commands
- Workflow guides accessible via `--help`

**New Flags:**
- `-q, --quiet` - Suppress output (useful for scripts)
- `-v, --verbose` - Show detailed progress
- `--debug` - Enable debugging output

**Configuration Options:**
- Set default PDF engine: `quire settings set pdfEngine prince`
- Set default EPUB engine: `quire settings set epubEngine pandoc`

---

### For Technical Users (Developers)

**Logging System:**
- Namespace-based debug logging via `DEBUG=quire:*`
- Printf-style formatting in logs: `logger.info('Building %s...', name)`
- Configurable log levels: trace, debug, info, warn, error, silent
- Configurable log prefix styles: bracket, emoji, plain, none

**Process Management:**
- Graceful Ctrl-C handling for all subprocesses
- No more orphaned Eleventy, Paged.js, or PrinceXML processes
- 5-second timeout for cleanup handlers
- Double Ctrl-C for immediate exit

**CLI Architecture:**
- Centralized error handling with meaningful exit codes
- Custom error classes for domain-specific errors
- Commands throw errors instead of calling `process.exit()`
- Reporter module wraps `ora` for progress indicators

**Configuration:**
- JSON schema validation for all config values
- Type coercion for boolean and number settings
- Helpful error messages for invalid config values

**Testing:**
- Expanded test coverage for all commands
- Integration tests for lib modules
- Test helpers for cross-platform paths

---

### For Technical Users (Maintainers)

**Code Architecture:**
- `lib/logger/index.js` - Centralized logging with factory pattern
- `lib/logger/debug.js` - Debug namespace wrapper
- `lib/reporter/index.js` - Progress indicator abstraction
- `lib/error/index.js` - Error handling and formatting
- `lib/process/manager.js` - Process lifecycle management
- `lib/doctor/` - Diagnostic check infrastructure

**Error Handling:**
- `QuireError` base class with error codes
- Domain-specific error subclasses
- Exit codes organized by workflow stage:
  - 0: Success
  - 1: General error
  - 10-19: Environment errors
  - 20-29: Project errors
  - 30-39: Build errors
  - 40-49: Output errors

**Command Pattern:**
- `Command` base class with `debug` and `logger` properties
- Standardized `preAction` hook signature
- Action methods bound to command instance
- `docsLink` and `helpText` properties for documentation

**Documentation:**
- `docs/cli-architecture.md` - Architecture overview
- `docs/cli-output-modes.md` - Output mode documentation
- `docs/workflows.md` - User workflow guides
- `docs/testing-commands.md` - Test patterns
- `DEVELOPMENT.md` - Development setup guide
- `mise.toml` - Task runner configuration

---

### For Programmatic Use

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Project error (not in project, creation failed) |
| 3 | Build error (Eleventy failed, config issues) |
| 4 | Validation error (YAML, schema) |
| 5 | Output error (PDF/EPUB generation, missing tools) |
| 6 | Install error (npm install, version not found) |
| 130 | Terminated by Ctrl-C (SIGINT) |
| 143 | Terminated by SIGTERM |

**Quiet Mode:**
```bash
quire build --quiet && quire pdf --quiet
echo "Exit code: $?"
```

**JSON Output:**
```bash
quire doctor --json > report.json
quire doctor --quiet --json report.json  # Silent with file output
```

**Debug Namespaces:**
```bash
DEBUG=quire:* quire build              # All debug output
DEBUG=quire:lib:* quire build          # Library modules only
DEBUG=quire:commands:* quire build     # Commands only
DEBUG=-quire:lib:git quire build       # Exclude git module
```

**Environment Variables:**
- `QUIRE_LOG_LEVEL` - Set log level (trace/debug/info/warn/error/silent)
- `DEBUG` - Enable debug namespaces

**Programmatic API:**
```javascript
import { logger, createLogger } from '@thegetty/quire-cli/lib/logger'
import { enableDebug, createDebug } from '@thegetty/quire-cli/lib/logger/debug'
import reporter from '@thegetty/quire-cli/lib/reporter'
import { ProcessManager } from '@thegetty/quire-cli/lib/process/manager'
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Merge conflicts | High | Medium | Rebase after each merge |
| Test failures | Medium | High | Run full test suite after each merge |
| Error handling gaps | Medium | Medium | Audit commands after #1143 merge |
| Breaking changes | Low | High | RC testing before final release |

---

## Post-Merge Checklist

- [ ] All 573+ tests pass
- [ ] `quire --help` shows all commands
- [ ] `quire doctor` runs all checks
- [ ] `quire build` shows progress spinner
- [ ] `quire build --quiet` produces no output
- [ ] `quire build --debug` shows debug logs
- [ ] Exit codes match documented values
- [ ] Error messages are user-friendly
- [ ] Documentation links work
- [ ] CI pipeline passes
- [ ] Changelog updated
- [ ] Version bumped to 1.0.0
