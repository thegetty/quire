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

replaces new-line characters with a space, resulting in unwanted white-space in the text.

```html
<span> Some inline text </span>
```

The `renderOneLine` tag strips indentation and removes new-line characters from the template, collapsing unwanted white-space to rendering the following string:

```html
<span>Some inline text</span>
```

## `stripHtmlTags`

Removes all html tags in a string. Useful for sanitizing text before passing it to another component or HTML attribute

### Example

It transforms something like this:

```html
<em>Dorothea Lange (<a href="http://vocab.getty.edu/page/ulan/500007674">ULAN</a>), Resettlement Administration photographer, in California</em>, 1936.
```

into this:

```
Dorothea Lange (ULAN), Resettlement Administration photographer, in California, 1936.
```
