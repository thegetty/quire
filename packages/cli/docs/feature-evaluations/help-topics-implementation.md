# Implementation: Extensible Help Topics System

**TODO Location:** [workflows.js:10-15](../../src/commands/workflows.js#L10-L15)

## Overview

Implement `quire help <topic>` as an extensible system that loads help content from markdown files or a topics directory. This replaces the hardcoded `workflows` command with a more scalable approach.

## Proposed Architecture

```
packages/cli/
├── src/
│   ├── commands/
│   │   └── help.js           # Main help command with <topic> argument
│   └── lib/
│       └── help/
│           ├── index.js      # Topic loader and renderer
│           └── topics/       # Markdown help topics (flat structure)
│               ├── configuration.md
│               ├── debugging.md
│               ├── epub.md
│               ├── pdf.md
│               ├── publishing.md
│               └── workflows.md
```

## Directory Structure Decision

### Flat vs. Nested

| Option | Structure | Pros | Cons |
|--------|-----------|------|------|
| **Flat (recommended)** | `topics/*.md` | Simple, easy discovery, no path syntax | Limited grouping |
| Nested | `topics/guides/*.md`, `topics/commands/*.md` | Organized by category | Requires path syntax (`quire help guides/pdf`), over-engineered |

**Decision: Flat structure.** Quire's scope (~10-15 topics) doesn't warrant hierarchy complexity.

### Topic Organization

| Approach | Example | Assessment |
|----------|---------|------------|
| **By domain (recommended)** | `quire help pdf` | User-centric, task-oriented |
| By command | `quire help build` | Duplicates `quire build --help` |
| By type | `quire help guide:workflows` | Adds cognitive overhead |

**Decision: Organize by domain.** Users think "what am I trying to do?" not "what type of documentation is this?"

### Relationship to Command Help

Help topics **complement** Commander's built-in help, not duplicate it:

| Source | Content Type | Example |
|--------|--------------|---------|
| `quire pdf --help` | Syntax, options, flags | `--engine <name>  PDF engine to use` |
| `quire help pdf` | Guides, examples, troubleshooting | When to use Paged.js vs PrinceXML |

### Configuration

The topics directory location is **not configurable** by design:
- Quire is a self-contained tool, not a plugin framework
- Topics should be versioned with the CLI
- Users expect help to "just work"

For development/testing, an environment variable override is supported:

```javascript
const TOPICS_DIR = process.env.QUIRE_HELP_TOPICS_DIR
  || path.join(__dirname, 'topics')
```

## Usage Examples

```bash
quire help                    # List available topics
quire help workflows          # Show workflows topic
quire help debugging          # Show debugging topic
quire help pdf                # Show PDF-specific help
```

## Output Conventions

The implementation uses different output mechanisms based on context:

| Use Case | Mechanism | Rationale |
|----------|-----------|-----------|
| Help content display | `console.log` | User-facing content, no prefix needed (matches Commander's help output) |
| Topic listing | `console.log` | User-facing content, consistent with help display |
| Error messages | `this.logger.error` | Error conditions should use the logger abstraction |
| Debug tracing | `this.debug()` | Internal debugging via createDebug namespace |
| Progress feedback | `reporter` | Not applicable for help command |

Nota bene: `console.log` is appropriate for help output because Commander's built-in help uses `process.stdout.write` directly. Adding logger prefixes (`[quire] INFO`) would clutter the help display.

## Implementation

### 1. Help Command (`src/commands/help.js`)

```javascript
import Command from '#src/Command.js'
import { listTopics, loadTopic, renderTopic } from '#lib/help/index.js'

/**
 * Quire CLI `help` Command
 *
 * Display help for a specific topic or list available topics.
 *
 * @class      HelpCommand
 * @extends    {Command}
 */
export default class HelpCommand extends Command {
  static definition = {
    name: 'help',
    description: 'Display help for a topic',
    summary: 'show help for a topic',
    docsLink: 'quire-commands/',
    version: '1.0.0',
    args: [
      ['[topic]', 'help topic to display']
    ],
    options: [
      ['--list', 'list all available topics'],
    ],
  }

  constructor() {
    super(HelpCommand.definition)
  }

  async action(topic, options, command) {
    this.debug('called with topic=%s options=%O', topic, options)

    // List topics if no topic specified or --list flag
    if (!topic || options.list) {
      const topics = await listTopics()
      // Nota bene: use console.log for user-facing help content (matches Commander's help output)
      console.log('Available help topics:\n')
      topics.forEach(({ name, description }) => {
        console.log(`  ${name.padEnd(16)} ${description}`)
      })
      console.log('\nRun "quire help <topic>" for detailed information.')
      return
    }

    // Load and display the requested topic
    const content = await loadTopic(topic)
    if (!content) {
      // Use logger for error conditions
      this.logger.error(`Unknown help topic: ${topic}`)
      console.log('Run "quire help --list" to see available topics.')
      process.exitCode = 1
      return
    }

    renderTopic(content)
  }
}
```

### 2. Help Library (`src/lib/help/index.js`)

```javascript
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import { markedTerminal } from 'marked-terminal'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Nota bene: env var override for development/testing only, not user-configurable
const TOPICS_DIR = process.env.QUIRE_HELP_TOPICS_DIR
  || path.join(__dirname, 'topics')

/**
 * Topic metadata extracted from markdown frontmatter
 * @typedef {Object} TopicMeta
 * @property {string} name - Topic identifier
 * @property {string} title - Display title
 * @property {string} description - Brief description for listing
 */

/**
 * List all available help topics
 * @returns {Promise<TopicMeta[]>} Array of topic metadata
 */
export async function listTopics() {
  const files = await fs.readdir(TOPICS_DIR)
  const topics = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    const name = path.basename(file, '.md')
    const content = await fs.readFile(path.join(TOPICS_DIR, file), 'utf-8')
    const meta = extractFrontmatter(content)

    topics.push({
      name,
      title: meta.title || name,
      description: meta.description || ''
    })
  }

  return topics.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Load a help topic by name
 * @param {string} name - Topic name (without .md extension)
 * @returns {Promise<string|null>} Topic content or null if not found
 */
export async function loadTopic(name) {
  const filePath = path.join(TOPICS_DIR, `${name}.md`)

  if (!await fs.pathExists(filePath)) {
    return null
  }

  const content = await fs.readFile(filePath, 'utf-8')
  return stripFrontmatter(content)
}

/**
 * Render markdown content to terminal
 * @param {string} content - Markdown content
 */
export function renderTopic(content) {
  marked.use(markedTerminal())
  console.log(marked(content))
}

/**
 * Extract YAML frontmatter from markdown
 * @param {string} content - Markdown content with optional frontmatter
 * @returns {Object} Parsed frontmatter or empty object
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const yaml = match[1]
  const meta = {}

  yaml.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      meta[key.trim()] = valueParts.join(':').trim()
    }
  })

  return meta
}

/**
 * Strip YAML frontmatter from markdown content
 * @param {string} content - Markdown content
 * @returns {string} Content without frontmatter
 */
function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '')
}
```

### 3. Example Topic File (`src/lib/help/topics/workflows.md`)

```markdown
---
title: Common Workflows
description: Step-by-step guides for common Quire tasks
---

# Common Workflows

## Starting a New Project

```bash
quire new my-book && cd my-book && quire preview
```

## Building for Web

```bash
quire build                  # Generate HTML site files
quire clean && quire build   # Clean build (recommended for production)
```

## Generating PDF

```bash
quire pdf --build            # Build first, then generate PDF
quire pdf --build --open     # Generate and open PDF
quire pdf --engine prince    # Use PrinceXML instead of Paged.js
```

## Generating EPUB

```bash
quire epub --build           # Build first, then generate EPUB
quire epub --build --open    # Generate and open EPUB
```

## Full Publication Build

```bash
quire clean && quire build && quire pdf && quire epub
```

## Troubleshooting

```bash
quire doctor                 # Run diagnostic checks
quire validate               # Check YAML files for errors
quire info                   # Show version information
quire build --verbose        # Build with detailed output
```

See full documentation: https://quire.getty.edu/docs-v1/
```

### 4. Additional Topic Files

**`topics/debugging.md`**
```markdown
---
title: Debugging
description: Troubleshooting builds and common issues
---

# Debugging Quire Projects

## Debug Output

Enable debug output to see detailed information:

```bash
quire build --debug          # Enable debug mode
DEBUG=quire:* quire build    # Enable all debug namespaces
DEBUG=quire:lib:pdf quire pdf  # Debug PDF module only
```

## Common Issues

### Build Fails with YAML Errors

Run validation to identify syntax issues:

```bash
quire validate
```

### PDF Generation Fails

1. Check that build output exists: `quire build`
2. Run with debug: `quire pdf --debug`
3. Check PrinceXML/Paged.js installation: `quire doctor`

### Preview Not Updating

Try a clean build:

```bash
quire clean && quire preview
```
```

**`topics/configuration.md`**
```markdown
---
title: Configuration
description: CLI configuration options and settings
---

# Quire CLI Configuration

## View Configuration

```bash
quire config                 # Show all settings
quire config get <key>       # Get specific value
quire config path            # Show config file location
```

## Common Settings

```bash
quire config set logLevel debug     # Set log level
quire config set updateChannel rc   # Use release candidate updates
quire config reset                  # Reset to defaults
```

## Configuration File

The configuration file is stored at:
- macOS: `~/Library/Preferences/quire-cli-nodejs/config.json`
- Linux: `~/.config/quire-cli-nodejs/config.json`
- Windows: `%APPDATA%\quire-cli-nodejs\config.json`
```

## Migration Plan

1. **Phase 1: Add help command** (non-breaking)
   - Create `help.js` command
   - Create `lib/help/` module
   - Add initial topic files
   - Register in `commands/index.js`

2. **Phase 2: Deprecate workflows command**
   - Keep `workflows` as alias to `help workflows`
   - Add deprecation notice

3. **Phase 3: Remove workflows command** (next major version)
   - Remove `workflows.js`
   - Update documentation

## Dependencies

New dependency required:
```json
{
  "marked": "^12.0.0",
  "marked-terminal": "^7.0.0"
}
```

Alternative: Use a simpler approach without marked, just displaying raw markdown with basic formatting.

## Effort & Priority

| Factor | Assessment |
|--------|------------|
| **Effort** | Medium (2-4 hours) |
| **Impact** | Medium - improves discoverability and documentation |
| **Risk** | Low - additive feature, no breaking changes |
| **Dependencies** | Optional: marked + marked-terminal for rich rendering |

## Benefits

1. **Extensible**: New topics can be added by creating markdown files
2. **Maintainable**: Documentation lives alongside code
3. **User-friendly**: `quire help` lists available topics
4. **Consistent**: Follows common CLI patterns (git help, npm help)

## Alternative: Simpler Implementation

If the marked dependency is undesirable, a simpler approach:

```javascript
export function renderTopic(content) {
  // Just print the markdown as-is (still readable in terminal)
  console.log(content)
}
```

This works because markdown is designed to be readable as plain text.
