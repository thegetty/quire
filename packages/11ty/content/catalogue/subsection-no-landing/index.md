---
title: Subsection Without Landing Page
menu: true
outputs: none
order: 300
toc: true
---
A section `index.md` file with a `title` is always required. This can be a landing page for the section or just a data file for the heading to use for section subpages in the menu and table of contents. To create a section index without a landing page, in the frontmatter set `outputs: none`. Note that setting `outputs: none` will exclude the page from the menu and TOC by default. To include the section heading in the menu or table of contents, set `menu: true` and/or `toc: true`, respectively.
