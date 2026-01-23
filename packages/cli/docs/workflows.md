# Quire CLI Common Workflows

This document provides detailed guidance for common workflows when using the Quire CLI.

## Starting a New Project

Create a new Quire publication and start previewing it immediately:

```bash
# Create a new project
quire new my-book

# Enter the project directory
cd my-book

# Start the preview server
quire preview
```

The `quire new` command will:
1. Download the starter template
2. Install npm dependencies
3. Set up the project structure

Once `quire preview` is running, open your browser to the URL shown (typically http://localhost:8080) to see your publication.

### Quick Start (One Line)

```bash
quire new my-book && cd my-book && quire preview
```

---

## Building for Web

Generate the HTML site files for web deployment:

```bash
quire build
```

This creates a `_site/` directory containing your complete publication. The output is ready to deploy to any static web host (GitHub Pages, Netlify, Vercel, etc.).

### Build Options

```bash
# Build with verbose debug output
quire build --verbose

# Clean previous builds first
quire clean && quire build

# Dry run (show what would be built without building)
quire build --dry-run
```

---

## Generating PDF

Create a print-ready PDF of your publication:

```bash
# If you've already run `quire build`
quire pdf

# Build first, then generate PDF (recommended)
quire pdf --build

# Open the PDF after generation
quire pdf --build --open
```

### PDF Engine Options

Quire supports two PDF generation engines:

```bash
# Use Paged.js (default, open source)
quire pdf --engine pagedjs

# Use PrinceXML (requires license for commercial use)
quire pdf --engine prince
```

### Setting a Default PDF Engine

Set your preferred PDF engine in config to avoid specifying `--engine` each time:

```bash
# Set PrinceXML as default
quire config set pdfEngine prince

# Now `quire pdf` uses PrinceXML automatically
quire pdf --build
```

The `--engine` flag always overrides the config setting when specified.

---

## Generating EPUB

Create an e-book version of your publication:

```bash
# If you've already run `quire build`
quire epub

# Build first, then generate EPUB (recommended)
quire epub --build

# Open the EPUB after generation
quire epub --build --open
```

### EPUB Engine Options

```bash
# Use epubjs (default)
quire epub --engine epubjs

# Use Pandoc
quire epub --engine pandoc
```

### Setting a Default EPUB Engine

Set your preferred EPUB engine in config:

```bash
# Set Pandoc as default
quire config set epubEngine pandoc

# Now `quire epub` uses Pandoc automatically
quire epub --build
```

The `--engine` flag always overrides the config setting when specified.

---

## Full Publication Workflow

Generate all output formats for a complete publication:

```bash
# 1. Clean any previous builds
quire clean

# 2. Build the HTML site
quire build

# 3. Generate PDF
quire pdf --open

# 4. Generate EPUB
quire epub --open
```

### One-Line Full Build

```bash
quire clean && quire build && quire pdf && quire epub
```

---

## Development Workflow

Typical workflow when actively editing content:

```bash
# Start preview server (auto-rebuilds on changes)
quire preview
```

The preview server watches for file changes and automatically rebuilds. Press `Ctrl+C` to stop.

### Preview with Debug Output

```bash
# Verbose mode
quire preview --verbose

# Specific debug modules
DEBUG=quire:lib:* quire preview
```

---

## Troubleshooting

### Clean Build

If you encounter unexpected issues, try a clean build:

```bash
quire clean
quire build
```

### Check Configuration

Validate your YAML configuration files:

```bash
quire validate
```

### View Version Information

```bash
# Show installed versions
quire info

# Show CLI version
quire --version
```

### Debug Mode

Enable detailed debug output:

```bash
# Via flag
quire build --verbose

# Via environment variable (more granular)
DEBUG=quire:* quire build
DEBUG=quire:lib:pdf quire pdf
DEBUG=quire:lib:epub quire epub
```

---

## Related Documentation

- [Quire Documentation](https://quire.getty.edu/docs-v1/)
- [CLI Architecture](./cli-architecture.md)
- [Testing Commands](./testing-commands.md)
