# Help Topics System

The help topics system provides extended documentation for Quire CLI users beyond the built-in `--help` output.

## Architecture

```
src/
├── commands/
│   └── help.js              # Help command (quire help [topic])
├── helpers/
│   └── pager.js             # Terminal paging utility
├── errors/
│   └── help/
│       └── help-topic-not-found-error.js
└── lib/
    └── help/
        ├── index.js         # Public API
        ├── frontmatter.js   # YAML frontmatter parsing
        └── topics/          # Markdown topic files
            ├── configuration.md
            ├── debugging.md
            ├── epub.md
            ├── pdf.md
            ├── publishing.md
            └── workflows.md
```

## Usage

```bash
quire help                 # List available topics
quire help workflows       # Display a specific topic
quire help --list          # Explicitly list topics
quire h pdf                # Alias 'h' works too
```

## Public API

### `lib/help/index.js`

```javascript
import { getTopicList, getTopicContent, getTopicsDir } from '#lib/help/index.js'

// Get formatted list of all topics (ready for display)
const list = await getTopicList()
// => "Available help topics:\n  debugging  Troubleshooting..."

// Get rendered topic content (ready for display)
const content = await getTopicContent('workflows')
// => "# Common Workflows\n\n## Starting a New Project..."

// Get topics directory path (for testing)
const dir = getTopicsDir()
```

### `lib/help/frontmatter.js`

```javascript
import { extractFrontmatter, stripFrontmatter, parseFrontmatter } from './frontmatter.js'

// Extract YAML frontmatter as object
const meta = extractFrontmatter(content)
// => { title: 'Workflows', description: 'Step-by-step guides' }

// Remove frontmatter, return body only
const body = stripFrontmatter(content)
// => '# Workflows\n\nContent...'

// Get both at once
const { data, content } = parseFrontmatter(rawContent)
```

### `helpers/pager.js`

```javascript
import { outputWithPaging } from '#helpers/pager.js'

// Output with automatic paging for long content in TTY
await outputWithPaging(content)
```

## Managing Topics

### Adding a Topic

1. Create a new markdown file in `src/lib/help/topics/`:

```markdown
---
title: Your Topic Title
description: Brief description for the topic list
---
# Your Topic Title

Content goes here...

## Section

More content...
```

2. The topic name is derived from the filename (without `.md`):
   - `my-topic.md` → `quire help my-topic`

3. No code changes required - topics are auto-discovered.

### Editing a Topic

1. Edit the markdown file directly in `src/lib/help/topics/`
2. Changes take effect immediately (no build step)

### Removing a Topic

1. Delete the markdown file from `src/lib/help/topics/`
2. No code changes required

### Topic File Format

```markdown
---
title: Display Title
description: One-line description shown in topic list
---
# Heading

Body content in standard markdown.

## Code Examples

    quire command --option    # Indented code blocks work

## Lists

- Item one
- Item two

## Links

See [documentation](https://quire.getty.edu/docs-v1/) for more.
```

**Frontmatter fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | No | Display title (defaults to filename) |
| `description` | No | One-line description for topic list (defaults to empty) |

### Frontmatter Parsing Limitations

The frontmatter parser uses a simple regex approach (`/^---\n([\s\S]*?)\n---/`) rather than a full-featured library like `gray-matter`. This is intentional for help topics since they are developer-controlled content, but has some limitations:

- **Unix line endings only**: Expects `\n` (LF), not `\r\n` (CRLF). Topic files must use Unix line endings.
- **Opening delimiter must be first**: The `---` must appear at the very start of the file with no leading whitespace or BOM.
- **No document separator support**: Does not recognize `...` as an alternative closing delimiter.
- **Silent failure**: Invalid YAML returns an empty object rather than throwing an error.

These limitations are acceptable because topics are controlled content committed to the repository. For user-supplied content, consider using `gray-matter` instead.

## Rendering

Topics are rendered for terminal display using:
- [marked](https://github.com/markedjs/marked) - Markdown parser
- [marked-terminal](https://github.com/mikaelbr/marked-terminal) - Terminal renderer

Output includes ANSI colors and formatting appropriate for terminal display.

## Paging

Long content is automatically paged when:
- Output is to an interactive terminal (TTY)
- Content exceeds terminal height

The pager uses:
- `$PAGER` environment variable if set
- `less -R` on Unix (preserves ANSI colors)
- `more` on Windows

Falls back to direct output if pager is unavailable.

## Error Handling

Unknown topics throw `HelpTopicNotFoundError`:

```
[quire] HELP_TOPIC_NOT_FOUND Unknown help topic: nonexistent
  Suggestion: Run "quire help --list" to see available topics
  Learn more: https://quire.getty.edu/docs-v1/quire-commands/
```

## Testing

```bash
# Run all help-related tests
npx ava src/lib/help/*.test.js src/commands/help.test.js src/helpers/pager.test.js

# Run specific test file
npx ava src/lib/help/frontmatter.test.js
```

### Test Environment

Set `QUIRE_HELP_TOPICS_DIR` to use a custom topics directory in tests:

```javascript
process.env.QUIRE_HELP_TOPICS_DIR = '/path/to/test/topics'
```

## Related

- [Commander.js help](https://github.com/tj/commander.js#custom-help)
