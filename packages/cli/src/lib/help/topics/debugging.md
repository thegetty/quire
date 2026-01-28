---
title: Debugging
description: Troubleshooting common issues
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

Common YAML problems:
- Missing colons after keys
- Incorrect indentation (use spaces, not tabs)
- Unquoted special characters
- Missing closing quotes

### PDF Generation Fails

1. Check that build output exists: `quire build`
2. Run with debug: `quire pdf --debug`
3. Verify the PDF engine is installed

### EPUB Generation Fails

1. Ensure the build is complete: `quire build`
2. Check for missing images or broken links
3. Run with debug: `quire epub --debug`

### Preview Not Updating

Try a clean build:

```bash
quire clean && quire preview
```

### "Not in a Quire project" Error

Make sure you're in a directory containing:
- `content/` directory
- An Eleventy configuration file (`.eleventy.js` or `eleventy.config.js`)

```bash
cd your-project-name
quire preview
```

## Getting Help

- Documentation: https://quire.getty.edu/docs-v1/
- Community Forum: https://github.com/thegetty/quire/discussions
- Issue Tracker: https://github.com/thegetty/quire/issues
