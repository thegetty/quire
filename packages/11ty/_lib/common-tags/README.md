This directory includes templating tags to extend functions included by `common-tags`.

## `renderOneLine`

Similar to `oneLine`, this function flattens html tags into a single line, stripping out whitespace that surrounds text nodes inside of tags. It allows template HTML for elements to include indentation for better readability without rendering the extra whitespace.

### Example

Using `oneLine` on a multi-line string literal like the following,

```html
<span>
  Some inline text
</span>
```

replaces new-line characters with a space, resulting in unwanted white-space in the text.

```html
<span> Some inline text </span>
```

The `renderOneLine` tag strips indentation and removes new-line characters from the template, collapsing unwanted white-space to rendering the following string:

```html
<span>Some inline text</span>
```
