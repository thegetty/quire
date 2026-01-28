---
title: EPUB Generation
description: Creating e-book publications
---

# EPUB Generation

## Quick Start

```bash
quire epub --build           # Build and generate EPUB
quire epub --build --open    # Build, generate, and open EPUB
```

## EPUB Engines

Quire supports two EPUB engines:

### epubjs (Default)

JavaScript-based EPUB generation.

```bash
quire epub                   # Uses epubjs by default
quire epub --lib epubjs      # Explicit epubjs
```

### Pandoc

Universal document converter with EPUB support. Requires separate installation.

```bash
quire epub --lib pandoc      # Use Pandoc
```

## Configuration

EPUB settings in `content/_data/config.yaml`:

```yaml
epub:
  output: _site/downloads/my-publication.epub
  # Additional EPUB-specific settings
```

## Troubleshooting

### EPUB fails validation

Common issues:
- Missing required metadata in `content/_data/publication.yaml`
- Invalid image formats (use JPEG or PNG)
- Broken internal links

### Images not appearing

1. Check image paths are relative
2. Ensure images are in supported formats
3. Verify images exist in the build output

### EPUB not opening in reader

1. Validate the EPUB file structure
2. Check for malformed HTML in content
3. Ensure all required files are included

## Testing Your EPUB

Open in different readers to verify:
- Apple Books (macOS/iOS)
- Calibre (cross-platform)
- Adobe Digital Editions

See full documentation: https://quire.getty.edu/docs-v1/epub-output/
