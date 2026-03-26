---
title: Publishing
description: Deploying your Quire publication
---

# Publishing Your Publication

## Build for Production

Always use a clean build for production:

```bash
quire clean && quire build
```

This ensures all files are freshly generated without stale artifacts.

## Output Formats

### Web (HTML)

The default `quire build` generates a static HTML site in `_site/`:

```bash
quire build
# Output: _site/
```

Deploy the `_site/` directory to any static hosting service.

### PDF

```bash
quire pdf --build
# Output: _site/downloads/*.pdf
```

### EPUB

```bash
quire epub --build
# Output: _site/downloads/*.epub
```

## Complete Publication Workflow

Generate all formats in one sequence:

```bash
quire clean && quire build && quire pdf && quire epub
```

## Deployment Options

### GitHub Pages

1. Push `_site/` to a `gh-pages` branch
2. Configure GitHub Pages in repository settings
3. Access at `https://username.github.io/repo-name/`

### Netlify / Vercel

1. Connect your repository
2. Set build command: `quire build`
3. Set publish directory: `_site`

### Traditional Hosting

Upload the contents of `_site/` to your web server via FTP/SFTP.

## Pre-Publication Checklist

- [ ] Run `quire validate` to check for errors
- [ ] Review all content for accuracy
- [ ] Test links and navigation
- [ ] Verify images display correctly
- [ ] Check PDF and EPUB in multiple readers
- [ ] Test on different devices and browsers

See full documentation: https://quire.getty.edu/docs-v1/site-deploy/
