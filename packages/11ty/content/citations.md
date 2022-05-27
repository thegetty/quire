---
title: Quire Citations
layout: page
contributor:
  - jkeller
---

## Quire
### Chicago
#### Publication
{% citation context='publication', page=pageData, type='chicago' %}

#### Page
{% citation context='page', page=pageData, type='chicago' %}

### MLA
#### Publication
{% citation context='publication', page=pageData, type='mla' %}

#### Page
{% citation context='page', page=pageData, type='mla' %}

## `citation-styles`
### Chicago
#### Publication
{% citationStylesLib context='publication', type='chicago' %}

#### Page
{% citationStylesLib context='page', page=pageData, type='chicago' %}

### MLA
#### Publication
{% citationStylesLib context='publication', type='mla' %}

#### Page
{% citationStylesLib context='page', page=pageData, type='mla' %}
