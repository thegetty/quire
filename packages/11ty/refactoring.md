# Quire refactoring

## Bundler

[eleventy-with-vite](https://opensourcelibs.com/lib/eleventy-with-vite),
[repository](https://github.com/fpapado/eleventy-with-vite)


## Components

See:
- https://github.com/adamduncan/eleventy-shortcomps
- https://www.trysmudford.com/blog/encapsulated-11ty-components/

## Layouts

https://www.raymondcamden.com/2021/08/19/using-liquid-blocks-in-eleventy-layouts

## Meta

https://github.com/tannerdolby/eleventy-plugin-metagen/


## Navigation

- https://github.com/jdsteinbach/eleventy-plugin-toc#readme


## Semantic HTML

HTML5 elements (e.g., `<header>`, `<footer>`, `<nav>`, `<menu>`, `<main>`, `<article>`, `<section>`, `<detail>`, `<summary>`, `<video>`, `<track>`)

_Nota bene:_ HTML5 elements require polyfills ((Modernizr HTML5 Cross Browser Polyfills)[https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills#details-and-summary]) to support Internet Explorer.

To correctly map these elements to accessibility APIs use the [Accessifyhtml5.js](https://github.com/yatil/accessifyhtml5.js) library.

### Accordions

For table of contents and content outlines, use HTML `<detail>` and `<summary>` elements within the list item elements of nested ordered list elements.

_Caveat_

> Unfortunately, at this time there's no built-in way to animate the transition between open and closed. --[MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)

#### References

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [How to Use the Details and Summary Elements in HTML5](https://blog.teamtreehouse.com/use-details-summary-elements)


## Styles

Refine class names to more consistently implement the BEM convention.

### Themes

See [Easily Use Design Tokens In Eleventy](https://heydonworks.com/article/design-tokens-in-eleventy/)


## Changelogs

[eleventy-plugin-recent-changes](https://github.com/workeffortwaste/eleventy-plugin-recent-changes/)
