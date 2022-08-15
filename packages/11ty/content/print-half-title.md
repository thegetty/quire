---
layout: base.11ty.js
order: 2
outputs: 
  - epub
  - pdf
toc: false
---
<div class="half-title-page">
  {% if publication.title %}
  <span class="title-htp">
    {{ publication.title }}
  </span>
  {% endif %}
</div>
