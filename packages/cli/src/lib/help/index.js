/**
 * Help topics module
 *
 * Provides loading and rendering of help topics from markdown files.
 * Topics are stored in the topics/ directory as markdown files with
 * YAML frontmatter for metadata.
 *
 * @module lib/help
 */
import fs from 'fs-extra'
import { marked } from 'marked'
import { markedTerminal } from 'marked-terminal'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HelpTopicNotFoundError } from '#src/errors/index.js'
import { extractFrontmatter, stripFrontmatter } from './frontmatter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Nota bene: env var override for development/testing only, not user-configurable
const TOPICS_DIR =
  process.env.QUIRE_HELP_TOPICS_DIR || path.join(__dirname, 'topics');

/**
 * Topic metadata extracted from markdown frontmatter
 * @typedef {Object} TopicMeta
 * @property {string} name - Topic identifier (filename without .md)
 * @property {string} title - Display title
 * @property {string} description - Brief description for listing
 */

/**
 * List all available help topics
 * @returns {Promise<TopicMeta[]>} Array of topic metadata sorted by name
 */
async function listTopics() {
  if (!await fs.pathExists(TOPICS_DIR)) {
    return []
  }

  const files = await fs.readdir(TOPICS_DIR)
  const topics = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue

    const name = path.basename(file, '.md')
    const content = await fs.readFile(path.join(TOPICS_DIR, file), 'utf-8')
    const meta = extractFrontmatter(content)

    topics.push({
      name,
      title: meta.title || name,
      description: meta.description || ''
    })
  }

  return topics.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Load a help topic by name
 * @param {string} name - Topic name (without .md extension)
 * @returns {Promise<string>} Topic content
 * @throws {HelpTopicNotFoundError} If topic does not exist
 */
async function loadTopic(name) {
  const filePath = path.join(TOPICS_DIR, `${name}.md`)

  if (!await fs.pathExists(filePath)) {
    throw new HelpTopicNotFoundError(name)
  }

  const content = await fs.readFile(filePath, 'utf-8')
  return stripFrontmatter(content)
}

/**
 * Render markdown content for terminal display
 * @param {string} content - Markdown content
 * @returns {string} Rendered content for terminal
 */
function renderTopic(content) {
  marked.use(markedTerminal())
  return marked.parse(content).trimEnd()
}

/**
 * Format topic list for display
 * @param {TopicMeta[]} topics - Array of topic metadata
 * @returns {string} Formatted topic list
 */
function formatTopicList(topics) {
  if (topics.length === 0) {
    return 'No help topics available.'
  }

  const lines = ['Available help topics:\n']
  topics.forEach(({ name, description }) => {
    lines.push(`  ${name.padEnd(16)} ${description}`)
  })
  lines.push('\nRun "quire help <topic>" for detailed information.')
  lines.push('Run "quire <command> --help" for command-specific options.')

  return lines.join('\n')
}

/**
 * Get formatted list of available help topics
 * @returns {Promise<string>} Formatted topic list for display
 */
export async function getTopicList() {
  const topics = await listTopics()
  return formatTopicList(topics)
}

/**
 * Get formatted help content for a topic
 * @param {string} name - Topic name
 * @returns {Promise<string>} Rendered topic content
 * @throws {HelpTopicNotFoundError} If topic does not exist
 */
export async function getTopicContent(name) {
  const content = await loadTopic(name)
  return renderTopic(content)
}

/**
 * Get the topics directory path (for testing)
 * @returns {string} Path to topics directory
 */
export function getTopicsDir() {
  return TOPICS_DIR
}
