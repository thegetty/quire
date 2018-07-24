---
title: Style Guide
subtitle: Visual Output
weight: 201
type: page
---
# Heading 1
## Heading 2
### Heading 3
#### Heading 4

Regular unmodified text in a paragraph structure. Regular unmodified text in a paragraph structure.Regular unmodified text in a paragraph structure. *Italic  text in a paragraph structure* .Regular unmodified text in a paragraph structure.Regular unmodified text in a paragraph structure.Regular unmodified text in a paragraph structure. **Bolded text in a paragraph structure.**

> This is a blockquote to designate quotes. This is a blockquote to designate quotes. This is a blockquote to designate quotes. This is a blockquote to designate quotes. This is a blockquote to designate quotes. This is a blockquote to designate quotes.

- This is a dashed list
- and it can keep going
  - and be indented
    - numerous times

1. Numbers will also
2. make a list
3. that can keep going

This is an example of a footnote.[^1] This is an example of an in-text citation using Author Date.({{< q-cite "Evans 1938" >}})

<br> <!-- This is an HTML blank line break that can be used in Markdown. -->

{{< q-figure id="1.1" >}}

Above is a figure image with no alignment.

---  
<!-- The three dashes above are a Markdown horizontal line break with an actual line instead of just spacing. -->

{{< q-figure id="1.1" class="is-pulled-left" >}}

To the left is a figure image aligned left. With some extra text to show how it wraps around the image. With some extra text to show how it wraps around the image. With some extra text to show how it wraps around the image. With some extra text to show how it wraps around.

---

{{< q-figure id="1.1" class="is-pulled-right" >}}

To the right is a figure image aligned right. With some extra text to show how it wraps around the image. With some extra text to show how it wraps around the image. With some extra text to show how it wraps around the image. With some extra text to show how it wraps around.

---

{{< q-figure-group grid="2" id="1.4, 1.5, 1.6,1.7" >}}

Above is a figure group of 4 set to grid rows of two.

### Notes

[^1]: This is the other part of the footnote.
