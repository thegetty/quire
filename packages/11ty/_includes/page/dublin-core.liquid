<link rel="schema.dcterms" href="https://purl.org/dc/terms/">

<meta name="dcterms.title" content="{{ site.params.title }}">

{% for contributor in publication.contributor | where: 'type', 'primary' %}
  <meta name="dcterms.creator" content="{{ contributor }}">
{% endfor %}

{% for contributor in publication.contributor | where: 'type', 'secondary' %}
  {% assign name = contributor.full_name or contributor.first_name | contributor.last_name | join: ' ' %}
  <meta name="dcterms.contributor" content="{{ name }}">
{% endfor %}

<meta name="dcterms.date" content="{{ publication.pub_date }}">

{% assign description = publication.description.one_line or publication.description.full %}
<meta name="dcterms.description" content="{{ description | truncate 160 }}">

<meta name="dcterms.identifier" content="{{ publication.identifier.isbn | replace: '-', '' }}">

<meta name="dcterms.language" content="{{ publication.language }}">

{% for publisher in publication.publisher %}
  <meta name="dcterms.publisher" content="{{ publisher.name }}, {{ publisher.location }}">
{% endfor %}

<meta name="dcterms.rights" content="{{ publication.copyright }}">

{% for subject in  publication.subject %}
  <meta name="dcterms.subject" content="{{ subject }}">
{% end %}
