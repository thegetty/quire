# CircleCI Configuration

Cross-platform test pipeline for Quire on Linux, macOS, and Windows.

> **Note on references:** This documentation includes line number references for quick navigation (e.g., `config.yml:47-52`). These may become outdated when the configuration file changes. When line numbers do not match, look for the referenced anchor names (e.g., `&npm_cache_key`), command names (e.g., `build_install_cli-linux`), or section headers in the YAML file.

## Table of Contents
- [Workflow Overview](#workflow-overview)
- [Architecture Patterns](#architecture-patterns)
- [Caching Strategy](#caching-strategy)
- [Performance](#performance)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Debugging Workflows](#debugging-workflows)
- [Troubleshooting](#troubleshooting)
- [Quick Reference](#quick-reference)
- [TODO](#todo)

## Workflow Overview

```
Push to GitHub
  ↓
config.yml (Setup)
  ↓
Setup Workflow (path-filtering)
  ↓
  ├─ Only markdown, mise, mise-tasks files → Skip Build
  └─ Code changes → Proceed with build.yml
       ↓
    build.yml (Build & Test)
       ↓
    build_install_test workflow
       ↓
       ├─ build_install_test-linux   (parallel)
       ├─ build_install_test-macos   (parallel)
       └─ build_install_test-win     (parallel)
            ↓
            ├─ browser_test-linux  (4 shards)
            ├─ browser_test-macos  (4 shards)
            └─ browser_test-win    (4 shards)
```

**Execution flow:**
1. **Setup configuration** ([config.yml](.circleci/config.yml)) - Path filtering decides whether to continue
2. **Build & test configuration** ([build.yml](.circleci/build.yml)) - Contains all build/test jobs
3. **Build jobs** run in parallel across 3 platforms (~5-9 min each)
4. **Browser test jobs** run only after corresponding build job completes (4 parallel shards per platform = 12 total jobs, ~2-3 min per shard)

**Total pipeline time:** ~7-12 minutes (bottlenecked by slowest platform's build + browser tests)

**Configuration Split:** CircleCI dynamic configuration requires separate setup and continuation files. The setup file (config.yml) contains `setup: true` and uses the path-filtering orb. When code files change, it continues to build.yml which contains all the actual build and test workflows.

## Architecture Patterns

### Path Filtering

Uses [`path-filtering` orb v3.0.0](https://circleci.com/developer/orbs/orb/circleci/path-filtering) to skip builds when only documentation or developer tooling changes.

**Configuration files:**
- **Setup:** [config.yml](.circleci/config.yml) - Contains `setup: true` and path-filtering logic
- **Build & Test:** [build.yml](.circleci/build.yml) - Contains all build/test workflows

**Pattern:**
```regex
^(?!mise\.toml$)(?!\.?mise(-tasks)?/).*(?<!\.md)$
```

This single regex pattern matches files that:
- ✅ Are NOT `mise.toml` (negative lookahead: `(?!mise\.toml$)`)
- ✅ Are NOT in mise directories (negative lookahead: `(?!\.?mise(-tasks)?/)`)
  - Excludes: `mise/`, `.mise/`, `mise-tasks/`, `.mise-tasks/`
- ✅ Do NOT end with `.md` (negative lookbehind: `(?<!\.md)`)

**Why:** Saves CI credits and time for documentation-only changes and local development tool configuration. These changes do not affect build output or test results.

**How it works:**
1. On every push, CircleCI loads `config.yml` (setup configuration)
2. `setup` workflow runs the `path-filtering/filter` job with `run-build-test-workflow: false` (default)
3. Path filtering examines changed files against `main` branch (see `base-revision`)
4. If ANY changed file matches the pattern, `run-build-test-workflow` is set to `true`
5. Path filtering continues pipeline to `build.yml` with the updated parameter
6. In `build.yml`, the `build_install_test` workflow runs only when `run-build-test-workflow: true`

**Examples:**

| Files Changed | Workflow? |
|---------------|-----------|
| `README.md` | Skip |
| `mise.toml` | Skip |
| `.mise/tasks/blargh.sh` | Skip |
| `.mise-tasks/test.sh` | Skip |
| `mise-tasks/build.sh` | Skip |
| `packages/cli/docs/README.md` | Skip |
| `packages/cli/src/index.js` | ✅ Run |
| `README.md`, `src/index.js` | ✅ Run |

### Branch Filtering

The `build_install_test` workflow ignores branches starting with `docs/` (see `filters.branches.ignore` in workflow jobs).

**Pattern:** `/^docs\/.*/` matches any branch name starting with `docs/`

**Why:** Documentation-only branches (e.g., `docs/update-readme`, `docs/api-reference`) don't need to run the full test suite. This works in combination with path filtering to skip builds for documentation work.

**Examples:**
- `main` - runs workflow
- `feature/new-command` - runs workflow
- `docs/update-guide` - skips workflow
- `docs/circleci-readme` - skips workflow

### Matrix Builds

Single `build_install_test` job definition (see `jobs.build_install_test` around [config.yml:220-232](config.yml#L220-L232)) runs across all platforms using [matrix parameters](https://circleci.com/docs/configuration-reference#matrix-requires-version-21) (see `&matrix_params` anchor around [config.yml:73-76](config.yml#L73-L76)).

**Why:** DRY principle - one job definition maintains consistency across platforms. Matrix parameters inject platform-specific commands (`build_install_cli-<os>`, `test-<os>`).

**Pattern:**
```yaml
matrix:
  parameters:
    os: ['linux', 'macos', 'win']
```
Expands to 3 jobs: `build_install_test-linux`, `build_install_test-macos`, `build_install_test-win`

### Browser Test Sharding

Playwright tests are sharded 4 ways per platform (see `jobs.browser_test.parallelism` around [config.yml:236-237](config.yml#L236-L237) and `scripts.test:browsers-circleci` in [package.json:30](../package.json#L30)).

**Why:** Reduces browser test duration from ~10 minutes to ~2-3 minutes per shard. Follows [Playwright's CircleCI recommendation](https://playwright.dev/docs/ci#sharding-in-circleci). Each shard runs ~10 tests across 2 test runs (root path + pathname).

**Implementation:**
```bash
SHARD="$((${CIRCLE_NODE_INDEX}+1))"
npx playwright test --shard=${SHARD}/${CIRCLE_NODE_TOTAL}
```
With `parallelism: 4`, creates shards 1/4, 2/4, 3/4, 4/4

### Separate Playwright Executor

Browser tests use dedicated [`playwright` Docker image](https://playwright.dev/docs/docker) (see `executors.playwright`) instead of running on build executors.

**Why:**
- The Playwright image (1.5GB) includes pre-installed browsers, avoiding 60-90s download per platform
- Separates build failures from browser test failures for clearer attribution
- Allows parallel execution (12 browser test jobs run concurrently after 3 build jobs complete)
- Saves build executor time for actual builds

### Test Execution Order

Tests run in this sequence (see `commands.run_tests` around [config.yml:153-170](config.yml#L153-L170)):
1. CLI unit tests (~2s)
2. 11ty unit tests (~8s)
3. End-to-end tests (~2-5 min)

**Why this order:** Fast failure detection. If unit tests fail, CI exits in seconds instead of wasting minutes on slow e2e tests. Unit test failures indicate basic broken functionality that would cause e2e tests to fail anyway.

### Executor-Specific Patterns

#### Linux Executor

**Configuration:** [Docker executor](https://circleci.com/docs/executor-intro#docker-executor) `cimg/node:22.10.0` running as `circleci` user (default, UID 3434) - see `executors.linux`

**Why non-root user:** Enables Chrome's [SUID sandbox](https://pptr.dev/troubleshooting#setting-up-chrome-linux-sandbox) for kernel-level process isolation. Chrome's security sandbox requires a non-root user to function properly.

**Security benefit:** Full Chrome sandbox protection without `--no-sandbox` workarounds. The `cimg/node` image is designed for the default `circleci` user with appropriate permissions for npm installs and file operations.

**NPM global installs:** Configured via `NPM_CONFIG_PREFIX` and `PATH` environment variables (see `executors.linux.environment`) to install global packages in user-writable location `/home/circleci/.npm-global`.

**Dependencies:** Chrome installed via [`browser-tools` orb](https://circleci.com/developer/orbs/orb/circleci/browser-tools) with caching (see `commands.build_install_cli-linux`)

#### macOS Executor

**Configuration:** [macOS executor](https://circleci.com/docs/executor-intro#macos-executor) `xcode:16.3.0` with Apple Silicon - see `executors.macos`

**Why explicit Node install:** Xcode image includes Node.js, but the version (e.g., 18.x) does not match our pipeline parameter (22.10.0). Explicit installation via [`node` orb](https://circleci.com/developer/orbs/orb/circleci/node) (see `commands.build_install_cli-macos`) ensures consistent Node version across all platforms.

**Dependencies:** Node.js + Chrome + ChromeDriver installed fresh each build (cached via browser-tools orb)

#### Windows Executor

**Configuration:** [Windows machine executor](https://circleci.com/docs/executor-intro#windows-executor) Server 2022 - see `executors.win`

**Why `bash.exe` shell:** The `node` orb uses bash syntax (e.g., `&&`, `export`) that does not work in PowerShell. PowerShell would require rewriting orb commands with PowerShell syntax (`-and`, `$env:`). See `executors.win.shell`.

**Why slower:** Windows VMs are slower than Docker containers. npm on Windows has higher I/O overhead. Historically 7x slower before cache optimizations.

**Dependencies:** Node.js + [Chocolatey](https://community.chocolatey.org/) packages (Chrome, ChromeDriver, zip) with caching (see `commands.build_install_cli-win`)

### Test Structure

**End-to-end tests** ([tests/e2e-test.mjs](../tests/e2e-test.mjs)):
1. Creates new publication via `quire new`
2. Builds HTML via `quire build`
3. Generates PDF via `quire pdf`
4. Generates EPUB via `quire epub`

**Browser tests** ([tests/publication.spec.js](../tests/publication.spec.js)):
- Run twice per platform: once at root path `/` and once with pathname `/quire-test-project/`
- Validate page titles, image URLs, IIIF canvas-panel dimensions
- Use sitemap for page discovery

**Why run twice:** Tests both simple (root path) and complex (subpath mounting) URL scenarios. The pathname test validates asset resolution when publication is mounted at a subdirectory.

## Caching Strategy

### NPM Cache

**Key:** `package-cache-{{ .Branch }}-{{ checksum "package-lock.json" }}-{{ .Environment.CACHE_VERSION }}` (see `&npm_cache_key` anchor around [config.yml:47](config.yml#L47))

**Components:**
- `.Branch`: Prevents cross-branch cache contamination (e.g., main vs feature branches with different dependencies)
- [`checksum "package-lock.json"`](https://circleci.com/docs/caching#cache-keys): Auto-invalidate when dependencies change
- `CACHE_VERSION`: Manual cache invalidation (bump to `v2`, `v3`, etc. when cache corrupted)

**Critical timing:** Cache must be saved AFTER test dependencies are installed (see `save_npm_cache-<os>` step in `jobs.build_install_test`), not before. Otherwise, test dependencies are not cached.

**Platform differences:**
- **Unix** (see `&npm_cache_paths_unix` anchor): [`~/.npm`](https://docs.npmjs.com/cli/v11/using-npm/config#cache), `~/.cache`, `node_modules`, `packages/*/node_modules`
- **Windows** (see `&npm_cache_paths_win` anchor): `C:\Users\circleci\AppData\Local\npm-cache`, `C:\Users\circleci\AppData\Roaming\npm`, `node_modules`, `packages/*/node_modules`

**Why platform-specific:** Windows and Unix use completely different cache directory locations. Using Unix paths on Windows would result in cache misses.

### Chrome Installation (Linux/macOS)

**Method:** Uses `browser-tools/install_chrome_for_testing` which installs both Chrome and ChromeDriver in a single step (see `build_install_cli-linux` and `build_install_cli-macos` commands).

```yaml
- browser-tools/install_chrome_for_testing
```

Uses defaults: `install_chromedriver: true`, `version: stable`.

```yaml
**Why no caching:** Chrome caching was removed due to reliability issues where Chrome would be cached without system dependencies, causing `libnspr4.so: cannot open shared object file` errors and incorrect Chrome versions (Beta instead of stable).

**Trade-off:** Each build downloads Chrome fresh (~2 minutes) but guarantees correct Chrome version with all dependencies.

### Chocolatey Cache (Windows)

**Key:** `choco-cache-{{ .Branch }}-{{ checksum ".circleci/packages.config" }}-{{ .Environment.CACHE_VERSION }}` (see `&choco-cache_key` anchor around [config.yml:49](config.yml#L49))

**Components:**
- `checksum ".circleci/packages.config"`: Auto-invalidate when Windows dependencies change
- `.Branch` + `CACHE_VERSION`: Same rationale as npm cache

**Cached paths** (see `save_cache.paths` in `commands.build_install_cli-win`):
- `C:\Program Files\Google\Chrome` - Chrome installation
- `C:\ProgramData\chocolatey\cache` - Chocolatey package cache
- `C:\tools\selenium` - Selenium tools

## Performance

### Expected Timings

| Platform | Total | Chrome | npm ci | CLI Tests | 11ty Tests | E2E Tests | Notes |
|----------|-------|--------|--------|-----------|------------|-----------|-------|
| **Linux** | 5-7 min | 30-60s¹ | 30-60s¹ | 2s | 8s | 2-4 min | Fastest executor |
| **macOS** | 7-9 min | 60-90s¹ | 45-90s¹ | 2s | 8s | 2-4 min | +Node install: 30-45s |
| **Windows** | 6-8 min | 30-60s² | 60-120s¹ | 2s | 8s | 2-4 min | +Node install: 45-60s |
| **Browser tests** | 2-3 min/shard | - | - | - | - | - | Playwright install: 30-45s |

¹ Cached timing / Fresh install adds 1-3 min
² Via Chocolatey cache

**Total pipeline:** ~7-12 minutes (limited by slowest platform + browser tests)

### Regression Detection

| Symptom | Expected | Indicates |
|---------|----------|-----------|
| Linux/macOS build time | < 8 min | > 8 min = cache miss or network issue |
| Windows build time | < 10 min | > 10 min = cache miss or Chocolatey failure |
| E2E test time | 2-4 min | > 6 min = build performance regression |
| Browser test shard | 2-3 min | > 4 min = Playwright slowdown or test bloat |

## Environment Variables

### CircleCI Built-in

- `CACHE_VERSION`: Manual cache invalidation flag (set in CircleCI project settings)
- `CIRCLE_BRANCH`: Current git branch
- `CIRCLE_NODE_INDEX`: Parallel job index (0-indexed, used for sharding)
- `CIRCLE_NODE_TOTAL`: Total parallel jobs (used for sharding)

### Custom

- `NPM_CONFIG_PREFIX`: npm global package install directory (Linux only: `/home/circleci/.npm-global`) - see `executors.linux.environment`
- `PUPPETEER_EXECUTABLE_PATH`: Chrome binary location (OS-specific) - see `executors.linux.environment`, `executors.macos.environment`, `executors.win.environment`
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: Prevents duplicate Chrome downloads on Windows (uses Chocolatey-installed Chrome) - see `executors.win.environment`

### How Environment Variables Are Used

**Sharding** (see `scripts.test:browsers-circleci` in [package.json:30](../package.json#L30)):
```bash
SHARD="$((${CIRCLE_NODE_INDEX}+1))"
npx playwright test --shard=${SHARD}/${CIRCLE_NODE_TOTAL}
```

**Cache keys** (see `anchors` section for `&npm_cache_key`, `&choco-cache_key` around [config.yml:46-52](config.yml#L46-L52)):
```yaml
- &npm_cache_key package-cache-{{ .Branch }}-{{ checksum "package-lock.json" }}-{{ .Environment.CACHE_VERSION }}
```

**Puppeteer configuration** (via executor environment variables):
- `PUPPETEER_EXECUTABLE_PATH`: Tells Puppeteer where to find Chrome (avoids downloading Chromium)
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: Prevents unnecessary 100MB+ Chromium download

## Local Development

### Running Tests Locally

```bash
# Install dependencies (same as CI)
npm ci --foreground-scripts

# Run tests in same order as CI
npm run test --workspace packages/cli    # ~2s
npm run test --workspace packages/11ty   # ~8s
npm run test:e2e                         # ~2-5 min
npm run test:browsers                    # Playwright tests
```

### Reproducing CI Environment

**Linux (Docker):**
```bash
docker run -it --rm -v $(pwd):/workspace -w /workspace cimg/node:22.10.0 bash
# Inside container: npm ci --foreground-scripts && npm test
```

**Validate config changes:**
```bash
# Install CircleCI CLI: brew install circleci
circleci config validate .circleci/config.yml
circleci config process .circleci/config.yml  # Expand orbs/anchors
```

### Debugging Tests

**Browser tests:**
```bash
npx playwright test --headed              # See browser
npx playwright test --debug               # Step through
npx playwright test tests/publication.spec.js  # Single file
```

**Failed test locally:**
```bash
npm run test:clean
rm -rf node_modules packages/*/node_modules
npm ci --foreground-scripts
npm run test --workspace packages/cli -- --match "*test name*"
```

## Debugging Workflows

### Workflow-Level Issues

**Workflow didn't trigger:**
```bash
# 1. Check if branch is filtered
# Branches starting with "docs/" are ignored
# Example: docs/update-readme → workflow skipped

# 2. Check path-filtering decision (check this BEFORE setup workflow)
# Only *.md, mise.toml, or .mise/ files changed → workflow skipped
# Examples that skip: README.md, mise.toml, .mise/tasks/test.sh

# 3. Check setup workflow ran
# Pipeline page → "setup" workflow should show

# 4. Check path-filtering output
# setup → path-filtering/filter job → Look for which files triggered/skipped

# 5. Verify workflow conditional
circleci config process .circleci/config.yml | grep -A 3 "when:"
# Look for: when: << pipeline.parameters.run-build-test-workflow >>

# 6. Force trigger via API
curl -X POST https://circleci.com/api/v2/project/github/thegetty/quire/pipeline \
  -H "Circle-Token: $CIRCLECI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"branch": "your-branch", "parameters": {"run-build-test-workflow": true}}'
```

**Job stuck in "Queued" or "Preparing":**
- Check CircleCI status: https://status.circleci.com/
- Verify resource class is available for your plan
- Check for workspace attachment issues (browser tests waiting for build artifacts)

**Matrix job didn't expand:**
```bash
# Validate matrix parameters syntax
circleci config process .circleci/config.yml | grep -A 10 "matrix:"
# Should see 3 jobs: build_install_test-linux, build_install_test-macos, build_install_test-win
```

**Browser tests didn't run despite build success:**
```bash
# Check workflow dependencies
circleci config process .circleci/config.yml | grep -A 5 "requires:"
# browser_test jobs require corresponding build_install_test jobs

# Verify workspace persistence
# build job logs → "persist_to_workspace" step should show files persisted
```

### Job-Level Debugging

**SSH into failing job:**
1. Pipeline → Click failing job → "Rerun Job with SSH"
2. Wait for job to reach failure point
3. SSH command appears in job output: `ssh -p 12345 1.2.3.4`
4. Debug interactively in `/home/circleci/project` (10 min session)

**Read logs efficiently:**
1. Click failed step (marked red)
2. "Switch to raw" (top right) for full output
3. Search (Cmd/Ctrl+F) for: `ERR!`, `Error:`, `FAIL`, `✗`, `exit code`

**Common log patterns:**

| Pattern | Meaning | Action |
|---------|---------|--------|
| `Cache not found` | Cache miss | Expected on first run; if repeated, check `CACHE_VERSION` |
| `npm ERR!` | npm failure | Check package-lock.json changes or npm registry |
| `Chrome failed to start` | Chrome issue | Verify Chrome installed and `PUPPETEER_EXECUTABLE_PATH` set |
| `EACCES: permission denied` | Permission issue | Check if running as `circleci` user (not root) |
| `attach_workspace` failure | Workspace missing | Verify upstream job persisted workspace |

**Test reports:**
- Pipeline → Job → "Tests" tab
- AVA: One entry per test file (expand for individual tests)
- Playwright: One entry per browser test (with screenshots if failed)

### Cache Debugging

**Invalidate cache:**
```bash
# Via UI:
# Project Settings → Environment Variables → Set CACHE_VERSION=2
```

**Verify cache behavior in logs:**
```bash
# Cache hit:
Found a cache from build 456 at npm_cache_key

# Cache miss:
Warning: Unable to find a cache for key npm_cache_key
```

### Config Changes

**Test safely:**
1. Push to feature branch (not `main`)
2. CircleCI uses feature branch's config automatically
3. Validate first: `circleci config validate .circleci/config.yml`

**Debug config issues:**
```bash
# Expand anchors and orbs to see final config
circleci config process .circleci/config.yml > expanded.yml
cat expanded.yml | grep -A 5 "your-change"
```

### Emergency Procedures

**All builds failing:**
1. Check outage: https://status.circleci.com/
2. Find breaking commit: `git log --oneline -10`
3. Quick fixes:
   - Cache: Set `CACHE_VERSION=2` in Project Settings
   - Dependencies: Revert `package-lock.json`
4. Emergency revert: `git revert <sha> && git push`

**Can't merge PR:**
1. Check if main is also failing (fix main first)
2. Rebase: `git rebase origin/main && git push --force-with-lease`
3. Compare CI vs local environment (use SSH debugging)
4. Override checks only for CircleCI outages (document reason)

## Troubleshooting

### Chrome Installation

| Symptom | Solution |
|---------|----------|
| Chrome installation slow (>3 min) | Normal - Chrome downloads fresh each build (~2 min) |
| Chrome won't start | Verify `PUPPETEER_EXECUTABLE_PATH` set and Chrome installed |

### npm/Dependencies

| Symptom | Solution |
|---------|----------|
| Dependencies re-download every build | Check `package-lock.json` changed / set `CACHE_VERSION=2` in Project Settings |
| Windows npm > 5 min | Verify `&npm_cache_paths_win` uses Windows paths (not Unix) |
| `EACCES: permission denied` | Check running as `circleci` user (not root) |

### Test Failures

| Symptom | Solution |
|---------|----------|
| Git error "paths ignored by .gitignore" | Remove artifacts: `rm -rf packages/11ty/{_site,_epub}` |
| Browser tests timeout | Check E2E job persisted workspace / verify `_site` directories exist |
| PDF/EPUB generation fails | Verify Chrome installed and `PUPPETEER_EXECUTABLE_PATH` correct |
| Workspace attachment error | Check upstream job completed successfully and persisted workspace |

## Quick Reference

### CircleCI UI Links

- **Pipelines:** https://app.circleci.com/pipelines/github/thegetty/quire
- **Project Settings:** https://app.circleci.com/settings/project/github/thegetty/quire
- **Organization Contexts:** https://app.circleci.com/settings/organization/github/thegetty/contexts
- **CircleCI Status:** https://status.circleci.com/

### Common Operations

| Task | How To |
|------|--------|
| Rerun workflow | Pipeline → Workflow → "Rerun Workflow from Start" |
| Rerun failed jobs only | Pipeline → Workflow → "Rerun Workflow from Failed" |
| SSH debug | Pipeline → Job → "Rerun Job with SSH" |
| View test results | Pipeline → Job → "Tests" tab |
| Download artifacts | Pipeline → Job → "Artifacts" tab |
| View raw logs | Pipeline → Job → Step → "Switch to raw" (top right) |
| Invalidate cache | Project Settings → Environment Variables → `CACHE_VERSION=2` |
| View workflow config | Pipeline → Workflow → "Configuration" tab |

### Command Reference

```bash
# Validate config
circleci config validate .circleci/config.yml

# Expand config (resolve anchors/orbs)
circleci config process .circleci/config.yml

# Run tests locally
npm ci --foreground-scripts
npm run test --workspace packages/cli
npm run test:e2e
npm run test:browsers

# Docker environment
docker run -it --rm -v $(pwd):/workspace -w /workspace cimg/node:22.10.0 bash

# Playwright debug
npx playwright test --headed
npx playwright test --debug

# Clean test artifacts
npm run test:clean

# Force workflow trigger via API
curl -X POST https://circleci.com/api/v2/project/github/thegetty/quire/pipeline \
  -H "Circle-Token: $CIRCLECI_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"branch": "branch-name", "parameters": {"run-build-test-workflow": true}}'
```

### External Documentation

- **CircleCI Config Reference:** https://circleci.com/docs/configuration-reference
- **browser-tools Orb:** https://circleci.com/developer/orbs/orb/circleci/browser-tools
- **path-filtering Orb:** https://circleci.com/developer/orbs/orb/circleci/path-filtering
- **Playwright CI:** https://playwright.dev/docs/ci
- **Chrome Linux Sandbox:** https://pptr.dev/troubleshooting#setting-up-chrome-linux-sandbox

## TODO

- [ ] Parameterize Node.js version matrix (test multiple versions)
- [x] Run core package tests before e2e tests (fixed: reordered test execution for faster failure detection)
- [ ] Remove publication.zip artifact storage when browser test coverage is complete
- [x] Replace Chrome `--no-sandbox` hack on Linux with proper sandboxing (fixed: removed `user: root` and enabled Chrome SUID sandbox)
- [x] Do not run CI for documentation-only changes (fixed: added `path-filtering` orb and `docs/*` branch filtering)
- [ ] Parameterize release version for `npm pack` commands
