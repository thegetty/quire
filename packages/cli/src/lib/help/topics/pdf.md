---
title: PDF Generation
description: Creating print-ready PDF publications
---

# PDF Generation

## Quick Start

```bash
quire pdf --build            # Build and generate PDF
quire pdf --build --open     # Build, generate, and open PDF
```

## PDF Engines

Quire supports two PDF engines:

### Paged.js (Default)

Open-source, browser-based PDF generation. No additional installation required.

```bash
quire pdf                    # Uses Paged.js by default
quire pdf --lib pagedjs      # Explicit Paged.js
```

### PrinceXML

Commercial PDF engine with advanced typography features. Requires separate installation.

```bash
quire pdf --lib prince       # Use PrinceXML
```

**When to use PrinceXML:**
- Complex typography requirements
- Specific print production needs
- Advanced CSS paged media features

## Configuration

PDF settings in `content/_data/config.yaml`:

```yaml
pdf:
  output: _site/downloads/my-publication.pdf
  # Additional PDF-specific settings
```

## Troubleshooting

### PDF is blank or missing content

1. Ensure build completed successfully: `quire build`
2. Check that `_site/pdf.html` exists
3. Run with debug: `quire pdf --debug`

### Fonts not rendering correctly

- Ensure fonts are properly installed or embedded
- Check font paths in your CSS

### Page breaks in wrong places

Use CSS page break properties:

```css
.chapter {
  page-break-before: always;
}
```

See full documentation: https://quire.getty.edu/docs-v1/pdf-output/
