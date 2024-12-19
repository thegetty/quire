# q-image-sequence

Provides a Lit webcomponent for displaying image sequences with a click-and-drag behvaior

## Overview

The component loads a comma-separated list of images passed to the component and allows the user to move forward / backward in the sequence of images by dragging in the UI or modifying the `rotate-to-index` or `index` properties (eg, via a `ref` tag or in the runtime application js).

### Attributes

The component takes a few attributes:
- `index` - Index to show in the sequence
- `interactive` - Whether to allow forward/backward user interaction
- `reverse` - Whether to allow reversing in the sequence (ie, left-swipe from index=0) 
- `rotate-to-index` - Index to rotate to
- `images` - Comma-separated list of images. *Note that images must use proper URI escaping to pass comma-separated-value parsing and HTML element attribute escaping!*

### Architecture

The component markup has three parts:
- A loading overlay that is shown when the sequence is buffering
- A call to action overlay shown after load but before interaction that invites click-drag/swipe gestures (called "descriptionOverlay" in the code)
- A canvas element managed via a Lit `ref`

Styles / css are loaded into the Lit template from `styles.js`.

If it is a non-interactive component it loads the first image of the sequence only (though remains responsive to `rotate-to-index` attribute changes).

If the component is interactive, it buffers a percentage of the total images passed at startup and waits for interaction (showing the loading-overlay and overlay as required).

On interaction, the component changes its `index` property, triggering a `drawImage` command to paint the canvas, cancelling the last animation frame drawn and storing the animation frame ID, filling its buffer as necessary. When in-flight requests are made they are deduplicated by storing the Promise returned by `fetch()`, releasing it after the image is buffered.


