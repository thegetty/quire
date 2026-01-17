# Quire Upgrade Analysis

## Summary

The `quire version` command is incomplete and misleading. It records a version preference but does not actually upgrade the project. This document analyzes the problem and recommends a path forward.

Related: [eleventy-virtual-templates-evaluation.md](eleventy-virtual-templates-evaluation.md) - Technical evaluation of Eleventy 3.0 features that could enable clean upgrades.

## Current Behavior

### What the command does

```javascript
// version.js
async action(version, options = {}) {
  const resolvedVersion = await latest(version)  // Validates against npm
  setVersion(resolvedVersion)                    // Writes to .quire file
}
```

The command:
1. Validates the version against the npm registry
2. Writes the version to the `.quire` file
3. **Does nothing else**

### What users expect

Users reasonably expect `quire version 1.1.0` to upgrade their project to version 1.1.0 of quire-11ty.

### The gap

The `.quire` file is never read by `build`, `preview`, or any other command to check if the installed version matches the requested version. There is no upgrade mechanism.

## Why This Is Hard

### The architectural problem

Unlike typical npm packages that live in `node_modules`, quire-11ty is extracted **directly into the project directory**:

```
my-project/
├── content/           # User content
├── _includes/         # From quire-11ty (but user may modify)
├── _layouts/          # From quire-11ty (but user may modify)
├── _plugins/          # From quire-11ty (but user may modify)
├── .eleventy.js       # From quire-11ty (but user may modify)
├── package.json       # From quire-11ty (user adds dependencies)
└── .quire             # Version file
```

This architecture was chosen because:
- Eleventy requires layouts/includes in specific locations
- Users need to customize templates for their publications
- Getty's workflow involves template modifications

### The upgrade conflict

| Directory | Origin | User Modifies? | Safe to Overwrite? |
|-----------|--------|----------------|-------------------|
| `content/` | User | Always | Never |
| `_includes/` | quire-11ty | Often | No |
| `_layouts/` | quire-11ty | Often | No |
| `_plugins/` | quire-11ty | Sometimes | No |
| `.eleventy.js` | quire-11ty | Sometimes | No |
| `package.json` | quire-11ty | Often (deps) | No |

A naive overwrite would destroy user customizations. A merge strategy would be complex and error-prone.

## Comparison: `quire new` vs `quire version`

### `quire new` (works)

```javascript
// installer.js - initStarter()
setVersion(quireVersion, projectPath)
await installer.installInProject(projectPath, quireVersion, options)
```

Creates a fresh project with no existing customizations to preserve.

### `quire version` (broken)

```javascript
// version.js
setVersion(resolvedVersion)
// installInProject() is never called
```

Even if `installInProject()` were called, it would overwrite user customizations:

```javascript
// installer.js - installInProject()
fs.cpSync(tempDir, projectPath, { recursive: true })  // Destructive
```

## Possible Solutions

### Option 1: Remove the command

**Pros:**
- Honest about current capabilities
- No misleading UX

**Cons:**
- Users have no upgrade path

**Implementation:**
- Delete `version.js`
- Update documentation to explain manual upgrade process

### Option 2: Rename to record-only

Rename to something like `quire pin` with clear documentation that it only records intent:

```
quire pin 1.1.0

Note: This records your target version but does not upgrade the project.
See https://quire.getty.edu/docs/upgrading for manual upgrade instructions.
```

**Pros:**
- Preserves the version tracking functionality
- Sets correct expectations

**Cons:**
- Still doesn't provide actual upgrade capability

### Option 3: Implement safe upgrade

Build a proper upgrade mechanism:

1. **Detect modifications** - Compare current files against known quire-11ty versions
2. **Generate diff** - Show what would change
3. **Selective update** - Only update unmodified files
4. **Migration guide** - Generate instructions for manually updating modified files

**Pros:**
- Provides real value
- Handles the complexity properly

**Cons:**
- Significant development effort
- Requires maintaining file manifests for each version
- Complex edge cases

### Option 4: Change architecture (long-term)

Move quire-11ty to `node_modules` and use Eleventy 3.0's virtual templates API:

```javascript
// quire-11ty plugin
export default function(eleventyConfig) {
  // Register layouts as virtual templates
  eleventyConfig.addTemplate("_layouts/base.liquid", layoutContent);
  eleventyConfig.addTemplate("_includes/header.liquid", headerContent);
}
```

**Pros:**
- Clean separation of framework and user content
- Standard npm upgrade workflow (`npm update`)
- User customizations via file overrides, not modifications
- No merge conflicts on upgrade

**Cons:**
- Breaking change for existing projects
- Significant rewrite of quire-11ty as Eleventy plugin
- Requires migration tooling for existing users
- Different mental model for customization

See [eleventy-virtual-templates-evaluation.md](eleventy-virtual-templates-evaluation.md) for detailed analysis of this approach.

## Resolution

**Decision:** Rename and hide the command

The command was renamed from `version` to `use` and hidden from help output:
- Renamed to avoid confusion with `quire --version` (CLI version)
- Hidden because the underlying upgrade mechanism was never implemented
- Clean upgrades are architecturally blocked by the current quire-11ty extraction model

**Implementation:**
- Renamed `src/commands/version.js` to `src/commands/use.js`
- Command name changed to `use` with `version` as alias (backwards compatibility)
- Added `hidden: true` to hide from help output
- Updated `src/main.js` to call `subCommand.hideHelp()` for hidden commands

**Note:** The `lib/project/version.js` utilities remain - they're used by `quire new` and `quire info`.

## Future Consideration

**Long term (Quire 2.0):** Option 4 - Architectural change

For Quire 2.0, consider moving quire-11ty to node_modules with Eleventy 3.0's virtual templates. This would make upgrades a standard `npm update` operation.

See [eleventy-virtual-templates-evaluation.md](eleventy-virtual-templates-evaluation.md) for technical details.

## Related Issues

- The `.quire` file serves as a project marker but its version data is unused
- `quire info` reads the version file for display but doesn't verify it matches what's installed
- No mechanism exists to detect version mismatches

## Conclusion

The `quire version` command was renamed to `quire use` and hidden from help output. The underlying upgrade problem is architecturally difficult due to the decision to extract quire-11ty directly into projects. A proper upgrade mechanism would require either significant development effort (safe upgrade with modification detection) or architectural changes (virtual templates in Quire 2.0).
