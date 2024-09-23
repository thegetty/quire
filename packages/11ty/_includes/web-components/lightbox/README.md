## `<q-lightbox>` lightbox web component

This directory contains the javascript boilerplate for producing the q-lightbox web component template and its interactivity. See also `_includes/components/lightbox` and `_incldues/components/modal` for usage.

## Architecture

`q-lightbox` provides a lightbox for quire figures via a [web component](), a technology for style and code encapsulation for UI components on the web.

The javscript here (via Lit boilerplate) produces the `q-lightbox` <template> and the lifecycle methods for managing data in the component when it first loads. 

### Markup

HTML markup for q-lightbox is generated in the `render()` function below, it has a few web component `slot` elements to ease compositing its contents. All are required for the lightbox to work:
- `slot="data"` should be a `<script>` tag containing the figures data. It is loaded on component startup.
- `slot="ui"` should be a `<div>` containing the lightbox UI
- `slot="slides"` contains slides that are dynamically generated after data load (or could be provided in markup as well).
- `slot="styles"` should contain a `<style>` tag with the styles for this lightbox.

### Styling

Styles for web components are strongly encapsulated, so inner elements (eg, the element expected to return from a selector like `q-lightbox > div`) are only responsive to the web component's stylesheet.

*Note this is also true from a javascript perspective!* That is, `document.querySelector('q-lightbox').querySelector('div')` would be the only correct way to query a `div` within a `q-lightbox` web component. 

The effect of this is that q-lightbox needs to contain the styles for all its inner componentry, and must contain them as CSS. 

#### Some trickery
Because only 11ty has build-time access to the sass stylesheets, `_includes/components/lightbox/styles.js` compiles the lightbox stylesheet at build time and inserts it into the component, where it loaded on component startup because WC styles must either be provided in the template or dynamically and Lit is entirely in runtime/browserspace.

### Interactivity
To display a child element of the slot as a slide, provide it with a `data-lightbox-slide` attribute set to anything and a `data-lightbox-slide-id`
set to a unique string (in our case, the figure id). **Note:** the value of `id` only needs to be unique among other slot children with `data-lightbox-slide` set

This lightbox provides access to controls with the following data attributes:
- `data-lightbox-fullscreen` triggers fullscreen on click and indicates status
- `data-lightbox-next` triggers rendering of next slide on click
- `data-lightbox-previous` triggers rendering of previous slide on click

It dynamically updates the content of elements with these data attributes:
- `data-lightbox-counter-current` displays the current slide index
- `data-lightbox-counter-total` displays total number of slides
