/**
 * Removes html tags from the provided string
 * @param      {String}
 * @return     {String}  String with no HTML
 */
export default function (string) {
  return string.replace(/(<([^>]+)>)/gi, '')
}
