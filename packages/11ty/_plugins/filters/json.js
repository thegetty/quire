/**
 * Replaces the default liquidjs json filter with specific arguments
 * @param      {Object}  data    JSON data to pretty print
 * @return     {String}  A formatted JSON string
 */
export default function (data) {
  return `<pre><code>${JSON.stringify(data, null, 2)}</code></pre>`
}
