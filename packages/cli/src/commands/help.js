import Command from '#src/Command.js'
import { outputWithPaging } from '#helpers/pager.js'
import { getTopicContent, getTopicList } from '#lib/help/index.js'

/**
 * Quire CLI `help` Command
 *
 * Display help for a specific topic or list available topics.
 * Complements Commander's built-in help with extended documentation.
 *
 * @example
 * quire help                 # List available topics
 * quire help workflows       # Show workflows topic
 * quire help --list          # List available topics
 *
 * @class      HelpCommand
 * @extends    {Command}
 */
export default class HelpCommand extends Command {
  static definition = {
    name: 'help',
    aliases: ['h'],
    description: 'Display help for a topic or list available topics',
    summary: 'show help for a topic',
    docsLink: 'quire-commands/',
    helpText: `
Examples:
  quire help                 List available help topics
  quire help workflows       Show common workflow examples
  quire help pdf             Show PDF generation guide
  quire help --list          List all available topics
`,
    version: '1.0.0',
    args: [
      ['[topic]', 'help topic to display']
    ],
    options: [
      ['--list', 'list all available topics'],
    ],
  }

  constructor() {
    super(HelpCommand.definition)
  }

  async action(topic, options, command) {
    this.debug('called with topic=%s options=%O', topic, options)

    // List topics if no topic specified or --list flag
    if (!topic || options.list) {
      const list = await getTopicList()
      process.stdout.write(list + '\n')
      return
    }

    // Display requested topic with paging (throws HelpTopicNotFoundError if missing)
    const content = await getTopicContent(topic)
    await outputWithPaging(content)
  }
}
