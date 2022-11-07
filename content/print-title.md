---
layout: base.11ty.js
order: 3
<<<<<<< HEAD:content/print-title.md
outputs:
  - epub
  - pdf
=======
outputs: pdf
>>>>>>> feature/11ty:packages/11ty/content/print-pdf-title.md
toc: false
---
<div class="title-page">
  {% if publication.title %}
  <span class="title-tp">
    {{ publication.title }}
  </span><br />
  {% endif %}
  {% if publication.subtitle %}
  <span class="sub-title">
    {{ publication.subtitle }}
  </span><br />
  {% endif %}
  <span class="contributor">
    {%- if publication.contributor_as_it_appears -%}
      {{ publication.contributor_as_it_appears | markdownify }}
    {%- else -%}
      {% contributors context=publicationContributors type="primary" format="string" %}
    {%- endif -%}
  </span><br />
  <span class="publisher">
    {%- for publisher in publication.publisher -%}
      {%- if publisher.name -%}
        {{ publisher.name }}{% endif %}{% if publisher.name and publisher.location %}, {% endif %}{% if publisher.location %}{{ publisher.location }}
      {%- endif -%}
    {%- endfor -%}
  </span>
</div>
