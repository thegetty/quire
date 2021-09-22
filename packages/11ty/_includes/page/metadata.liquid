{% liquid
assign description = page.abstract or publication.description.one_line or publication.description.full
assign keywords = publication.subject | where: 'type', 'keyword' | name
assign primary_contributors = publication.contributor | where: 'type', 'primary'
assign secondary_contributors = publication.contributor | where: 'type', 'secondary'
assign contributors = primary_contributors | concat secondary_contributors
%}

<link rel="canonical" href="{{ permalink }}">

<meta name="description" content="{{ description | truncate 160 }}">

<meta name="keywords" content="{{ keywords }}">

<link rel="version-history" href="{{ publication.repository_url }}">

{% for publisher in publication.publisher %}
  <link rel="publisher" href="{{ publisher.url }}">
{% endfor %}

{% for contributor in publication.contributor | where: 'type', 'primary' %}
  <link rel="author" href="{{ contributor.url }}">
{% endfor %}

{% render '_includes/dublin-core' %}
{% render '_includes/json-ld' %}
{% render '_includes/open-graph' %}
{% render '_includes/twitter-card' %}
