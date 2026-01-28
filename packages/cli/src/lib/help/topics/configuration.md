---
title: Configuration
description: Project and CLI configuration options
---

# Configuration

## Project Configuration

The `content/_data/publication.yaml` file contains publication settings:

```yaml
title: My Publication
subtitle: A Quire Book
contributor:
  - type: primary
    first_name: Jane
    last_name: Doe

url: https://my-publication.example.com
```

## Common Settings

### Publication Metadata

```yaml
title: Publication Title
subtitle: Optional Subtitle
reading_line: Additional context
pub_date: 2024-01-15
```

### Output Configuration

```yaml
pdf:
  output: _site/downloads/publication.pdf

epub:
  output: _site/downloads/publication.epub
```

### Build Options

```yaml
debug: false
verbose: false
```

## CLI Configuration

The CLI stores user preferences separately from project settings.

### View Configuration

```bash
quire config                 # Show all settings
quire config path            # Show config file location
```

### Configuration File Location

- **macOS:** `~/Library/Preferences/quire-cli-nodejs/config.json`
- **Linux:** `~/.config/quire-cli-nodejs/config.json`
- **Windows:** `%APPDATA%\quire-cli-nodejs\config.json`

## Environment Variables

Override settings via environment variables:

```bash
DEBUG=quire:* quire build            # Enable debug output
QUIRE_LOG_LEVEL=debug quire preview  # Set log level
```

See full documentation: https://quire.getty.edu/docs-v1/configuration/
