{% liquid
if type != 'essay'
  assign title = site.title
  assign url = site.baseURL
  assign description = publication.description.one_line or publication.description.full
  assign image = publication.promo_image
else
  assign title = page.title
  assign url = permalink
  assign description = page.abstract or publication.description.one_line or publication.description.full
  assign image = page.cover or publication.promo_image
endif %}

<meta property="og:title" content="{{ title }}" />
<meta property="og:url" content="{{ url }}" />
<meta property="og:image" content="{{ image }}" />
<meta property="og:description" content="{{ description | truncate 160 }}" />

{% if type != 'essay' %}
  {% if publication.pub_type == 'book' %}
    <meta property="og:type" content="book" />
    {% assign contributors = publication.contributor | where: 'type', 'primary' %}
    {% for contributor in contributors %}
      {% if contributor.full_name %}
        {% assign name = contributor.full_name %}
      {% else %}
        {% assign name = contributor.first_name | contributor.last_name | join: ' ' %}
      {% endif %}
      <meta property="og:book:author" content="{{ name }}"/>
    {% endfor %}
    <meta property="og:book:isbn" content="{{ publication.identifier.isbn | replace: '-' '' }}" />
    <meta property="og:book:release_date" content="{{ publication.pub_date }}" />
  {% endif %}

{% else %}
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="{{ site.title }}" />
  <meta property="og:article:published_time" content="{{ publication.pub_date }}" />
  {% for contributor in page.contributors %}
    {% if contributor.id %}
      {% assign contributor = publication.contributor[contributor.id] %}
      {% if contributor.full_name %}
        {% assign name = contributor.full_name %}
      {% else %}
        {% assign name = contributor.first_name | contributor.last_name | join: ' ' %}
      {% endif %}
    {% else %}
    <meta property="og:article:author" content="{{ name }}" />
  {% endfor %}
{% endif %}
