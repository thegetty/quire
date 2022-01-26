module.exports = function (context, figure) {
  return `
    {% if src %}
      <img
        id="{{ id }}"
        class="q-figure__image"
        src="{{ site.params.imageDir }}/{{ src }}"
        alt="{{ alt }}"
      />
    {% else %}
      <div class="q-figure__media-fallback">
        <div class="placeholder">
          <span class="fallback-image">
            <img src="{{ site.params.imageDir }}/icons/{{ mediaType }}.png" />
          </span>
        </div>
      </div>
    {% endif %}

    {% if label && figureLabelLocation and 'on-top' %}
      {% render 'figures/label', label: label %}
    {% endif %}
  `
}