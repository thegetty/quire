---
layout: page
order: 5
classes:
  - copyright-page
outputs:
  - epub
  - pdf
toc: false
---

{% copyright %}

{% if publication.identifier.isbn %}
ISBN: {{ publication.identifier.isbn }}
{% endif %}
