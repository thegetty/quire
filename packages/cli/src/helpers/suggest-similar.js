/**
 * Fuzzy string matching for CLI suggestions
 *
 * Uses Damerau-Levenshtein distance (optimal string alignment variant)
 * to find close matches for misspelled user input. The algorithm and
 * parameters match Commander.js's built-in suggestion implementation
 * for consistency.
 *
 * @module helpers/suggest-similar
 */

const MAX_DISTANCE = 3
const MIN_SIMILARITY = 0.4

/**
 * Calculate Damerau-Levenshtein distance between two strings
 *
 * Supports insertions, deletions, substitutions, and transpositions
 * of adjacent characters. Each substring is edited at most once
 * (optimal string alignment variant).
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 * @private
 */
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > MAX_DISTANCE) {
    return Math.max(a.length, b.length)
  }

  const d = []

  for (let i = 0; i <= a.length; ++i) d[i] = [i]
  for (let j = 0; j <= b.length; ++j) d[0][j] = j

  for (let j = 1; j <= b.length; ++j) {
    for (let i = 1; i <= a.length; ++i) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,        // deletion
        d[i][j - 1] + 1,        // insertion
        d[i - 1][j - 1] + cost, // substitution
      )
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }

  return d[a.length][b.length]
}

/**
 * Find similar strings from a list of candidates
 *
 * Returns the closest matches by edit distance, filtered by a minimum
 * similarity threshold (40%). Only returns matches at the best distance
 * found (does not mix distances).
 *
 * @param {string} word - The misspelled input
 * @param {string[]} candidates - Valid values to match against
 * @returns {string[]} Sorted array of best matches (empty if none close enough)
 *
 * @example
 * suggestSimilar('gt', ['get', 'set', 'delete', 'reset', 'path'])
 * // → ['get']
 *
 * @example
 * suggestSimilar('logLeve', ['logLevel', 'logPrefix', 'verbose'])
 * // → ['logLevel']
 */
export function suggestSimilar(word, candidates) {
  if (!word || !candidates?.length) return []

  const unique = [...new Set(candidates)]
  let similar = []
  let bestDistance = MAX_DISTANCE

  for (const candidate of unique) {
    if (candidate.length <= 1) continue

    const distance = editDistance(word, candidate)
    const length = Math.max(word.length, candidate.length)
    const similarity = (length - distance) / length

    if (similarity > MIN_SIMILARITY) {
      if (distance < bestDistance) {
        bestDistance = distance
        similar = [candidate]
      } else if (distance === bestDistance) {
        similar.push(candidate)
      }
    }
  }

  return similar.sort((a, b) => a.localeCompare(b))
}

/**
 * Format suggestion matches into a user-facing string
 *
 * @param {string[]} matches - Array of suggested matches
 * @returns {string|undefined} Formatted suggestion or undefined if no matches
 *
 * @example
 * formatSuggestion(['logLevel'])
 * // → 'Did you mean: logLevel?'
 *
 * @example
 * formatSuggestion(['get', 'set'])
 * // → 'Did you mean one of: get, set?'
 *
 * @example
 * formatSuggestion([])
 * // → undefined
 */
export function formatSuggestion(matches) {
  if (!matches?.length) return undefined
  if (matches.length === 1) return `Did you mean: ${matches[0]}?`
  return `Did you mean one of: ${matches.join(', ')}?`
}
