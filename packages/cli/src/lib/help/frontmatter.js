/**
 * YAML frontmatter parsing utilities
 *
 * Extracts and strips YAML frontmatter from markdown content.
 * Frontmatter is delimited by `---` on its own line.
 *
 * @module lib/help/frontmatter
 */
import yaml from 'js-yaml'

/** Regex to match YAML frontmatter block */
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/

/**
 * Extract YAML frontmatter from markdown content
 *
 * @param {string} content - Markdown content with optional frontmatter
 * @returns {Object} Parsed frontmatter data or empty object if none/invalid
 *
 * @example
 * const meta = extractFrontmatter(`---
 * title: My Topic
 * description: A description
 * ---
 * # Content`)
 * // => { title: 'My Topic', description: 'A description' }
 */
export function extractFrontmatter(content) {
  const match = content.match(FRONTMATTER_REGEX)
  if (!match) return {}

  try {
    return yaml.load(match[1]) || {}
  } catch {
    return {}
  }
}

/**
 * Strip YAML frontmatter from markdown content
 *
 * @param {string} content - Markdown content with optional frontmatter
 * @returns {string} Content without frontmatter block
 *
 * @example
 * const body = stripFrontmatter(`---
 * title: My Topic
 * ---
 * # Content`)
 * // => '# Content'
 */
export function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, '')
}

/**
 * Parse markdown content with frontmatter
 *
 * Convenience function that returns both metadata and content body.
 *
 * @param {string} content - Markdown content with optional frontmatter
 * @returns {{ data: Object, content: string }} Parsed frontmatter and body
 *
 * @example
 * const { data, content } = parseFrontmatter(`---
 * title: My Topic
 * ---
 * # Content`)
 * // data => { title: 'My Topic' }
 * // content => '# Content'
 */
export function parseFrontmatter(content) {
  return {
    data: extractFrontmatter(content),
    content: stripFrontmatter(content)
  }
}
