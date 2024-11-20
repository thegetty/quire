# q-image-sequence

Provides a simple Lit webcomponent for handling image sequences

## Overview

The component loads a comma-separated list of images passed to the component into a view that moves forward / backward in the sequence of images by dragging in the UI or modifying the `rotate-to-index` or `index` properties.

### Parameters

The component takes a few parameters:
- `index` - Index to show in the sequence
- `reverse` - Whether to allow reversing in the sequence (ie, left-swipe from index=0) 
- `rotate-to-index` - Index to rotate to
- `images` - Comma-separated list of images. *Note that images must use proper URI escaping to pass comma-separated parsing!*
