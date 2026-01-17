# Eleventy 3.0 Virtual Templates Evaluation

## Overview

This document evaluates whether Eleventy 3.0's new features enable separating quire-11ty framework code from user content, which would allow:

1. Installing quire-11ty as a standard npm dependency
2. Upgrading projects via `npm update` instead of file extraction
3. Clean separation between framework and user customizations

### Related Documents

- [quire-upgrade-analysis.md](quire-upgrade-analysis.md) - Analysis of the `quire version` command and upgrade problem
- [cli-ux-evaluation.md](cli-ux-evaluation.md) - CLI user experience evaluation

## Current Architecture

Quire projects currently have quire-11ty extracted directly into the project directory:

```
my-project/
├── content/           # User content
├── _includes/         # From quire-11ty (user may modify)
├── _layouts/          # From quire-11ty (user may modify)
├── _plugins/          # From quire-11ty (user may modify)
├── .eleventy.js       # From quire-11ty (user may modify)
├── package.json       # From quire-11ty (user adds dependencies)
└── .quire             # Version file
```

This architecture was chosen because Eleventy historically required layouts and includes to be within or relative to the input directory.

## Eleventy Directory Limitations

### The Core Constraint

From the [Eleventy configuration documentation](https://www.11ty.dev/docs/config/):

> "This value is relative to your input directory!"

Both `dir.includes` and `dir.layouts` must be paths relative to `dir.input`. There is no native support for:

- Absolute paths
- Paths to `node_modules`
- Paths outside the input directory

### addLayoutAlias Limitations

The `addLayoutAlias()` method also expects paths relative to `dir.input`. Using absolute paths or node_modules paths produces invalid results:

```
./src/_includes/./node_modules/govuk-eleventy-plugin/layouts/post.njk
```

See [GitHub Issue #864](https://github.com/11ty/eleventy/issues/864) for details.

## What Changed in Eleventy 3.0

### Issue #2307 Resolution

[Issue #2307](https://github.com/11ty/eleventy/issues/2307) ("Allow plugins to provide layouts and includes") was closed as part of Eleventy 3.0.0 in December 2024.

However, the solution was **not** multiple layout directories as originally proposed:

```javascript
// This was proposed but NOT implemented
dir: {
  layouts: ['_layouts', 'node_modules/my-plugin/layouts']
}
```

Instead, Eleventy added the **Virtual Templates API**.

### Virtual Templates API

Eleventy 3.0 introduced [`addTemplate()`](https://www.11ty.dev/docs/virtual-templates/), allowing plugins to inject templates programmatically:

```javascript
export default function(eleventyConfig) {
  // Register a virtual layout
  eleventyConfig.addTemplate("_includes/base.html", `
    <!DOCTYPE html>
    <html>
      <head><title>{{ title }}</title></head>
      <body>{{ content }}</body>
    </html>
  `);

  // Register virtual content
  eleventyConfig.addTemplate("robots.njk", "User-agent: *\nAllow: /", {
    permalink: "/robots.txt",
  });
};
```

Key characteristics:

- Virtual templates don't exist as physical files in the project
- They get written to the output directory like normal templates
- Plugins can register layouts, includes, and content templates
- The path acts as a unique identifier for template lookup

### API Signature

```javascript
eleventyConfig.addTemplate(virtualPath, content, data = {});
```

| Parameter | Description |
|-----------|-------------|
| `virtualPath` | Path relative to input directory, determines template language |
| `content` | Template content as string (can include front matter) |
| `data` | Optional data object (alternative to front matter) |

## Proposed Quire Architecture

### New Structure

```
my-project/
├── content/              # User content (unchanged)
├── _includes/            # User overrides only (optional)
├── _layouts/             # User overrides only (optional)
├── node_modules/
│   └── @thegetty/
│       └── quire-11ty/   # Framework as npm package
│           ├── layouts/
│           ├── includes/
│           ├── plugins/
│           └── index.js  # Eleventy plugin
├── .eleventy.js          # Minimal config, imports quire plugin
├── package.json          # User dependencies + quire-11ty
└── .quire                # Optional version pinning
```

### How It Would Work

1. **Install quire-11ty as npm package**
   ```bash
   npm install @thegetty/quire-11ty
   ```

2. **Quire plugin registers virtual templates**
   ```javascript
   // node_modules/@thegetty/quire-11ty/index.js
   import fs from 'fs';
   import path from 'path';

   export default function(eleventyConfig) {
     const layoutsDir = path.join(__dirname, 'layouts');

     // Register all layouts as virtual templates
     for (const file of fs.readdirSync(layoutsDir)) {
       const content = fs.readFileSync(path.join(layoutsDir, file), 'utf8');
       eleventyConfig.addTemplate(`_layouts/${file}`, content);
     }

     // Same for includes...
   }
   ```

3. **User imports plugin in .eleventy.js**
   ```javascript
   import quirePlugin from '@thegetty/quire-11ty';

   export default function(eleventyConfig) {
     eleventyConfig.addPlugin(quirePlugin);
   };
   ```

4. **User can override by creating physical files**
   ```
   # Physical file takes precedence over virtual template
   _layouts/base.liquid  # User's custom version
   ```

### Upgrade Workflow

```bash
# Upgrade quire-11ty to latest version
npm update @thegetty/quire-11ty

# Or pin to specific version
npm install @thegetty/quire-11ty@1.2.0
```

No file extraction, no merge conflicts, clean upgrade path.

## Comparison

| Aspect | Current | Virtual Templates |
|--------|---------|-------------------|
| quire-11ty location | Extracted into project | node_modules |
| Upgrade mechanism | None (manual) | npm update |
| User customizations | Modify framework files | Override with physical files |
| Framework/content separation | Mixed | Clean |
| Version control noise | Framework files in repo | Only user content |
| Dependency management | Manual | Standard npm |

## Challenges

### 1. Migration Effort

Significant rewrite of quire-11ty required:

- Convert to Eleventy plugin architecture
- Enumerate and register all templates as virtual
- Handle template discovery and registration
- Update all internal template references

### 2. Override Precedence

Need to verify that physical files take precedence over virtual templates. From Eleventy docs, virtual templates behave like physical files, so standard Eleventy resolution should apply.

### 3. User Mental Model

Different customization workflow:

**Current:** "Edit the layout file"
**New:** "Create an override file with the same name"

This is actually a better pattern (similar to theme overrides in many systems) but requires documentation updates.

### 4. Existing Projects

Migration path needed for existing projects:

1. Remove extracted quire-11ty files
2. Install quire-11ty as dependency
3. Update .eleventy.js to use plugin
4. Move any customized templates to override locations

### 5. Template Discovery

The plugin must dynamically discover and register all templates:

```javascript
// Must handle nested directories, multiple template types, etc.
function registerTemplates(dir, prefix = '') {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      registerTemplates(path.join(dir, entry.name), `${prefix}${entry.name}/`);
    } else {
      const content = fs.readFileSync(path.join(dir, entry.name), 'utf8');
      eleventyConfig.addTemplate(`${prefix}${entry.name}`, content);
    }
  }
}
```

## Recommendation

### Short Term

No changes to current architecture. Document the limitation and manual upgrade process.

### Medium Term (Quire 1.x)

Investigate hybrid approach:

1. Keep current extraction for backwards compatibility
2. Add experimental plugin mode for new projects
3. Gather feedback on override workflow

### Long Term (Quire 2.0)

Full migration to virtual templates architecture:

1. Rewrite quire-11ty as Eleventy plugin
2. Use addTemplate() for all framework templates
3. Document override workflow
4. Provide migration tooling for existing projects
5. Standard npm upgrade workflow

## Conclusion

**Eleventy 3.0's virtual templates make clean separation architecturally possible.** The `addTemplate()` API provides the mechanism for plugins to inject layouts and includes without requiring them to be physical files in the project directory.

This would enable:

- Installing quire-11ty as a standard npm dependency
- Upgrading via `npm update`
- Clean separation between framework and user content
- Override-based customization instead of modification

However, this requires significant restructuring and is appropriate for a major version release (Quire 2.0), not a patch or minor update.

## References

- [Eleventy Configuration](https://www.11ty.dev/docs/config/)
- [Eleventy Virtual Templates](https://www.11ty.dev/docs/virtual-templates/)
- [Eleventy Layouts](https://www.11ty.dev/docs/layouts/)
- [Issue #2307 - Allow plugins to provide layouts](https://github.com/11ty/eleventy/issues/2307)
- [Issue #864 - Layouts from node_modules](https://github.com/11ty/eleventy/issues/864)
- [Virtual Templates Blog Post](https://www.aleksandrhovhannisyan.com/blog/eleventy-virtual-templates/)
