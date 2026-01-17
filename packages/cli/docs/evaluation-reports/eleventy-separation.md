# Evaluation: Separating Eleventy from Project Content

This document evaluates the feasibility of decoupling quire-11ty framework files from Quire project content directories.

## Vision

The goal is to have Quire projects contain only user content while the Eleventy framework (quire-11ty) lives separately:

```
# Current State (files copied into project)
project/
├── .eleventy.js          # Framework
├── _includes/            # Framework
├── _layouts/             # Framework
├── _plugins/             # Framework
├── content/              # User content
│   └── _data/
└── package.json

# Desired State (framework separate)
~/.quire-cli/
  versions/
    1.0.0/                # quire-11ty framework
      _includes/
      _layouts/
      _plugins/
      .eleventy.js

project/
  content/                # User content only
    _data/
    *.md
  .quire-version          # Points to framework version
```

## Current Implementation

The `.eleventy.js` configuration already uses environment variables and relative paths to support separation:

```javascript
const inputDir = process.env.ELEVENTY_INPUT || 'content'
const includesDir = process.env.ELEVENTY_INCLUDES || path.join('..', '_includes')
const layoutsDir = process.env.ELEVENTY_LAYOUTS || path.join('..', '_layouts')
```

## Eleventy Path Resolution Constraints

### Directory Configuration

| Directory | Relative To | Can Reference External Paths? |
|-----------|-------------|-------------------------------|
| `input` | Config file location | Yes |
| `output` | Config file location | Yes |
| `includes` | Input directory | Partial (via `../`) |
| `layouts` | Input directory | Partial (via `../`) |
| `data` | Input directory | Partial (via `../`) |

### Key Limitation: Passthrough Copy

Eleventy's `addPassthroughCopy()` only accepts paths **descending from the site's root directory**. This is documented in [Issue #3017](https://github.com/11ty/eleventy/issues/3017).

Error message: *"Destination is not in the site output directory. Check your passthrough paths."*

This fundamentally blocks copying assets from an external quire-11ty location.

## Technical Challenges

### 1. Passthrough Copy Paths

```javascript
// This works (relative to config)
eleventyConfig.addPassthroughCopy(`${inputDir}/_assets`)

// This fails if quire-11ty is external
eleventyConfig.addPassthroughCopy('/absolute/path/to/quire-11ty/_assets')
```

### 2. Plugin Import Resolution

Quire plugins use import aliases (`#plugins/`, `#lib/`) that resolve relative to the quire-11ty package location. If config is external to project, plugins need:
- Absolute path configuration
- Dynamic path resolution at runtime
- Environment variable injection

### 3. Vite Integration

The Vite plugin has tight coupling to project structure:

```javascript
vitePlugin(eleventyConfig, globalData)
```

Vite resolves paths relative to its config, conflicting with separated structures.

### 4. Watch Targets

Watch targets are relative to config file:

```javascript
eleventyConfig.addWatchTarget('./**/*.css')
```

Would need absolute paths or explicit project directory references.

## Feasibility Matrix

| Approach | Feasibility | Effort | Notes |
|----------|-------------|--------|-------|
| **Copy into project** (current) | Works | Low | Reliable, disk-heavy |
| **Symlink** quire-11ty | Moderate | Medium | Cross-platform issues |
| **Environment variables** | Possible | High | Already partially implemented |
| **Full separation** | Difficult | Very High | Blocked by Eleventy limitations |

## Recommended Approaches

### Option 1: Symlink Model (Medium Effort)

```
project/
├── content/
│   └── _data/
├── .quire -> ~/.quire-cli/versions/1.0.0/  # Symlink to framework
└── .quire-version
```

**Advantages:**
- Single source of quire-11ty per version
- Updates apply to all projects using that version
- Smaller project directories

**Disadvantages:**
- Windows compatibility (requires junctions or developer mode)
- `npm install` still needed per project
- Symlink management complexity

**Implementation:**
1. Install quire-11ty versions to `~/.quire-cli/versions/<version>/`
2. Create symlink in project: `.quire -> ~/.quire-cli/versions/1.0.0/`
3. Run Eleventy from symlinked location with `ELEVENTY_INPUT` pointing to project content

### Option 2: npm Workspaces (High Effort)

Structure as monorepo with quire-11ty as workspace dependency:

```json
{
  "workspaces": ["node_modules/@thegetty/quire-11ty"]
}
```

**Blockers:**
- [Issue #3017](https://github.com/11ty/eleventy/issues/3017) — passthrough copy fails with hoisted deps
- Tracked in [Discussion #4015](https://github.com/11ty/eleventy/discussions/4015)

### Option 3: Wait for Eleventy Improvements (Future)

Monitor and potentially contribute to:
- [Discussion #4015](https://github.com/11ty/eleventy/discussions/4015) — workspace support
- Enhanced programmatic API with explicit path configuration

## Current Workarounds in Codebase

The CLI already implements partial separation via the programmatic API:

```javascript
// lib/11ty/api.js
const factory = async (options = {}) => {
  const config = paths.getConfigPath()
  const input = paths.getInputDir()
  const output = paths.getOutputDir()

  const eleventy = new Eleventy(input, output, {
    configPath: options.config || config,
    // ...
  })
}
```

Environment variables in `.eleventy.js`:
- `ELEVENTY_INPUT` — Content directory
- `ELEVENTY_OUTPUT` — Build output directory
- `ELEVENTY_DATA` — Data directory relative to input
- `ELEVENTY_INCLUDES` — Includes directory relative to input
- `ELEVENTY_LAYOUTS` — Layouts directory relative to input
- `ELEVENTY_ENV` — Build mode (production/development)

## Conclusion

**Full separation is not currently practical** due to Eleventy's path resolution architecture, particularly the passthrough copy limitation.

**The most viable near-term approach** is the **symlink model** combined with existing environment variable support. This requires:

1. Cross-platform symlink handling (Windows junctions)
2. Version management in CLI (`~/.quire-cli/versions/`)
3. Project initialization that creates symlinks instead of copying
4. Careful handling of `node_modules` (still per-project)

The current approach of copying quire-11ty into projects, while consuming more disk space, remains the most reliable option until Eleventy provides better support for external configuration locations.

## References

- [Eleventy Configuration Docs](https://www.11ty.dev/docs/config/)
- [Eleventy Programmatic API](https://www.11ty.dev/docs/programmatic/)
- [Issue #3017: Workspace Passthrough Support](https://github.com/11ty/eleventy/issues/3017)
- [Discussion #4015: Workspace/Monorepo Support](https://github.com/11ty/eleventy/discussions/4015)
