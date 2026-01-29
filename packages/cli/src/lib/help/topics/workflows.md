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
quire pdf --lib prince       # Use PrinceXML instead of Paged.js
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
quire validate               # Check YAML files for errors
quire info                   # Show version information
quire build --verbose        # Build with detailed output
```

See full documentation: https://quire.getty.edu/docs-v1/
