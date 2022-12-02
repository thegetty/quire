const { html } = require('~lib/common-tags')

/**
 * Google Analytics
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 */
module.exports = function(eleventyConfig) {
  const { googleId } = eleventyConfig.globalData.config.analytics
  return function(params) {
    if (!googleId) return ''
    return html`
      <script>
        (function(i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
          }, i[r].l = 1 * new Date();
          a = s.createElement(o),
              m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', '${googleId}', 'auto');
        ga('require', 'linkid', 'linkid.js');
        ga('send', 'pageview');
        document.addEventListener('DOMContentLoaded', function() {
          var links = document.querySelectorAll("a[href$='pdf'],a[href$='rtf'],a[href$='doc'],a[href$='xls'],a[href*='bit.ly'],a[href$='csv'],a[href$='json'],a[href$='zip'],a[href$='ppt'],a[href*='epub'],a[href*='mobi']")
          var link, pdfLabel, pdfOnClick;
          for (var i=0; i < links.length; i++) {
            link = links[i];
            pdfLabel = link.getAttribute('href');
            pdfOnClick = "ga('send', 'pageview','" + pdfLabel + "');";
            link.setAttribute("onClick", pdfOnClick);
          }
        }, { once:true });
      </script>
    `
  }
}
