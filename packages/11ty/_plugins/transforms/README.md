This directory includes templating helpers to transform text beyond functions included by `common-tags` 

## `renderOneLine`

Similar to `oneLine`, this function flattens html tags into a single line, stripping out whitespace that surrounds text nodes inside of tags. It allows template HTML for elements to include indentation for better readability without rendering the extra whitespace.

### Example

When using `oneLine`, a structure like this

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

