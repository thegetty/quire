---
layout: page
title: Contributors
weight: 201
---
{% for contributor in contributors %}
  {% if contributor.type === "primary" %}
    {% qcontributor contributor=contributor, entryType="publication" %}
  {% endif %}
{% endfor %}
