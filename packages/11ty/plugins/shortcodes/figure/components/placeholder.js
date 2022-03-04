module.exports = function(eleventyConfig, globalData) {
  const { config } = globalData

  return function(params) {
    const { figure } = params
    const { id, label, mediaType, src } = figure
    return `
      {% if src %}
        <img
          id="{{ id }}"
          class="q-figure__image"
          src="{{ config.params.imageDir }}/{{ src }}"
          alt="{{ alt }}"
        />
      {% else %}
        <div class="q-figure__media-fallback">
          <div class="placeholder">
            <span class="fallback-image">
              <img src="{{ config.params.imageDir }}/icons/{{ mediaType }}.png" />
            </span>
          </div>
        </div>
      {% endif %}

      {% if label && config.params.figureLabelLocation and 'on-top' %}
        {% render 'figures/label', label: label %}
      {% endif %}
    `
  }
}
