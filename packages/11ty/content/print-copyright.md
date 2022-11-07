---
class: backmatter
layout: base.11ty.js
order: 5
outputs:
  - epub
  - pdf
title: Copyright
---

{% copyright %}

{% if publication.identifier.isbn %}
ISBN: {{ publication.identifier.isbn }}
{% endif %}
