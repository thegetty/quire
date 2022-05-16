This directory includes templating tags to extend functions included by `common-tags`. **Nota bene**: these are not strictly 11ty plugins, but they are used by javascript component shortcodes.

## `renderOneLine`

Similar to `oneLine`, this function flattens html tags into a single line, stripping out whitespace that surrounds text nodes inside of tags. It allows template HTML for elements to include indentation for better readability without rendering the extra whitespace.

### Example

Using `oneLine` on a multi-line string literal like the following,

```html
<span>
  Some inline text
</span>
```

Gets rendered like this:

```html
<span> Some inline text </span>
```

Instead, `renderOneLine` renders it like this:

```html
<span>Some inline text</span>
```

