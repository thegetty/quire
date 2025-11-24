# q-search-results-list

## Overview

The `q-search-results-list` component displays and manages search results using Pagefind search integration.

## Usage

```html
<q-search-results-list query="search term"></q-search-results-list>
```

### Attributes

The component takes a `query` attribute with the search query string to search for in a Pagefind index.

### Styling

- `.search-list` - Results container
- `.search-result` - Individual result item
- `.search-subresults` - Sub-results list

- `.result-title` - Result header area
- `.result-link` - Result links
- `.result-item` - Content container
    - `.result-item-image` - Image container
    - `.result-item-content` - Text content area
    - `.result-meta` - Metadata paragraphs
    - `.result-excerpt` - Excerpt text