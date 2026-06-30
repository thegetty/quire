/**
 * @function snakeToCamelCase
 *
 * @param {string} content
 *
 * @returns {string}
 *
 * Converts a string in snake-case to camelCase
 *
 **/
export default function snakeToCamelCase (content) {
  const parts = content.split('-')
  const capitalized = parts.map((part, i) => {
    const first = i > 0 ? part.charAt(0).toUpperCase() : part.charAt(0)

    return (first + part.substring(1))
  })

  return capitalized.join('')
}
