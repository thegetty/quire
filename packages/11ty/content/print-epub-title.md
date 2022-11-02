---
layout: base.11ty.js
order: 4
outputs: epub
toc: false
---
<section epub:type="titlepage">
{% if publication.title %}
  <h1 class="title">{{ publication.title }}{% if publication.subtitle %}: {{ publication.subtitle }} {% if publication.reading_line %} {{ publication.reading_line | markdownify }}{% endif %}{% endif %}</h1>
{% endif %}

{% for contributor in contributors | where: contributor.type = "primary" %}
  <p class="author">{{ contributor.name }}</p>
{% endfor %}

{% for publisher in publication.publisher %}
  <p class="publisher">{{ publisher.name }}</p>
{% endfor %}

{% if publication.pub_date %}
  <p class="date">{{ publication.pub_date }}</p>
{% endif %}

{% if publication.copyright %}
  <div class="rights">{{ publication.copyright }}</div>
{% endif %}
</section>
