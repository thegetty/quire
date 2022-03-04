---
layout: page
title: Contributors
weight: 201
---
{% for contributor in contributors %}
  {% if contributor.type == 'primary' %}
    {%- contributor contributor=contributor, entryType='publication' -%}
  {% endif %}
{% endfor %}
