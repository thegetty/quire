## `<q-lightbox>` lightbox web component

This component renders image slides with navigation UI. It provides a default slot for passing markup to render.

To display an element as a slide, provide it with a `data-lightbox-slide` attribute set to any value

This lightbox provides access to controls with the following data attributes:
- `data-lightbox-fullscreen` triggers fullscreen on click and indicates status
- `data-lightbox-next` triggers rendering of next slide on click
- `data-lightbox-previous` triggers rendering of previous slide on click

It dynamically updates the content of elements with these data attributes:
- `data-lightbox-counter-current` displays the current slide index
- `data-lightbox-counter-total` displays total number of slides
