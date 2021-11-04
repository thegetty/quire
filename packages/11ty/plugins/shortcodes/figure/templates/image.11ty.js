/*
{% assign figureId = 'deepzoom' | append date %}
{% assign modalLink = figureId | prepend: '#'  %}
{% assign src = site.params.imageDir, src | join: '/' %}

{% if figureModal %}
  <figure
    class="q-figure leaflet-outer-wrapper mfp-hide notGet"
    id="{{ figureId }}"
    title="{{ caption }}"
  >
    <div
      id="js-{{ figureId }}"
      aria-label="Zoomable image"
      aria-live="polite"
      class="quire-deepzoom inset leaflet-inner-wrapper "
      role="application"
      src="{{ src }}"
    />
  </figure>
  <a
    class="inline popup"
    data-type="inline"
    href="{{ link }}"
    title="{{ caption }}"
  >
{% endif %}

  <img alt="{{ alt }}" class="q-figure__image" src="{{ src }}" />

{% if figureModal and label %}
  {% if figureLabelLocation == 'on-top' %}
    {% render 'figures/label' caption credit label link %}
  {% endif %}
{% endif %}

{% if figureModal %}
  </a>
{% endif %}

{% render 'figures/caption' %}
*/

module.exports = function(eleventyConfig, data) {
  return `<img alt="${data.alt}" class="q-figure__image" src="${data.src}" />`
}
