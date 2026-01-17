# ADR: Help Topics System

**Status:** Accepted
**Date:** 2026-01-22
**Decision Makers:** CLI Team

## Context

The Quire CLI needed extended documentation beyond Commander.js's built-in `--help` output. Users need guidance on workflows, troubleshooting, and feature-specific topics that don't fit in command help text.

**Requirements:**
- Display markdown-formatted help topics in the terminal
- List available topics with descriptions
- Page long content in interactive terminals
- Throw typed errors for unknown topics

## Decision

Implement a help topics system with:
1. Markdown files with YAML frontmatter stored in `lib/help/topics/`
2. A help library (`lib/help/index.js`) providing `getTopicList()` and `getTopicContent()`
3. A pager utility (`helpers/pager.js`) for long content
4. A `help` command that delegates to the library

### Architecture

```
src/commands/help.js
    ├── imports lib/help/index.js (topic loading/rendering)
    └── imports helpers/pager.js (terminal paging)

src/lib/help/
    ├── index.js (public API: getTopicList, getTopicContent, getTopicsDir)
    └── topics/
        ├── workflows.md
        ├── debugging.md
        ├── pdf.md
        ├── epub.md
        ├── configuration.md
        └── publishing.md

src/helpers/pager.js (outputWithPaging - reusable utility)

src/errors/help/help-topic-not-found-error.js
```

### Public API

```javascript
// lib/help/index.js
export async function getTopicList()     // Returns formatted topic list string
export async function getTopicContent(name)  // Returns rendered markdown string
export function getTopicsDir()           // Returns topics directory path (testing)

// helpers/pager.js
export async function outputWithPaging(content)  // Pipes to less/more if needed
```

### Topic File Format

```markdown
---
title: Common Workflows
description: Step-by-step guides for common Quire tasks
---
# Common Workflows

Content here...
```

## Alternatives Considered

### 1. Inline help in command definitions

**Rejected:** Command `helpText` is limited to short examples. Extended documentation needs proper formatting, code blocks, and sections.

### 2. External documentation only (website)

**Rejected:** Users should have offline access to common guidance. CLI help should be self-contained.

### 3. gray-matter for frontmatter parsing

**Rejected:** Adds ~15KB dependency. Since we control the topic files (repo-checked, known format), a simple regex + `js-yaml` (already installed) is sufficient.

### 4. console.log for output

**Rejected:** `process.stdout.write()` is more explicit for help content. Paging requires piping to system pager, not console methods.

## Consequences

### Positive

- **Offline documentation** - Users can access help without internet
- **Maintainable** - Topics are markdown files, easy to edit
- **Consistent UX** - Paging matches `man` and `git help` conventions
- **Typed errors** - `HelpTopicNotFoundError` provides actionable suggestions
- **Reusable pager** - `outputWithPaging` can be used by other commands
- **Testable** - Clean separation allows mocking at module boundaries

### Negative

- **Duplication risk** - Topic content may drift from website docs
- **No search** - Users must know topic names (mitigated by `--list`)
- **Pager dependency** - Requires `less` or `more` on system (fallback to direct output)

## Implementation Notes

### YAML Parsing

Uses `js-yaml` (existing dependency) with custom regex extraction:

```javascript
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/

function extractFrontmatter(content) {
  const match = content.match(FRONTMATTER_REGEX)
  if (!match) return {}
  try {
    return yaml.load(match[1]) || {}
  } catch {
    return {}
  }
}
```

This handles all standard YAML syntax while avoiding a new dependency. Edge cases (CRLF, empty frontmatter) don't apply to our controlled topic files.

### Paging Logic

```javascript
export async function outputWithPaging(content) {
  const lines = content.split('\n').length
  const isTTY = process.stdout.isTTY
  const terminalRows = process.stdout.rows || 24

  if (isTTY && lines > terminalRows) {
    // Pipe to system pager (less -R preserves ANSI colors)
    const pager = process.env.PAGER || (process.platform === 'win32' ? 'more' : 'less')
    // ... spawn pager process
  }

  // Direct output for non-TTY or short content
  process.stdout.write(content + '\n')
}
```

### Error Handling

`HelpTopicNotFoundError` extends `InvalidInputError`:

```javascript
throw new HelpTopicNotFoundError('nonexistent')
// Output:
// [quire] HELP_TOPIC_NOT_FOUND Unknown help topic: nonexistent
//   Suggestion: Run "quire help --list" to see available topics
//   Learn more: https://quire.getty.edu/docs-v1/quire-commands/
```

## Related

- [Commander.js help configuration](https://github.com/tj/commander.js#custom-help)
- [marked-terminal](https://github.com/mikaelbr/marked-terminal) for markdown rendering
