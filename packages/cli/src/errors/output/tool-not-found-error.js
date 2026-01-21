import QuireError from '../quire-error.js'

/**
 * Error thrown when a required external tool is not found
 *
 * @param {string} toolName - The name of the tool (e.g., 'prince', 'pandoc')
 * @param {Object} [toolInfo] - Tool metadata provided by the calling façade
 * @param {string} [toolInfo.displayName] - Human-readable tool name
 * @param {string} [toolInfo.installUrl] - URL where tool can be downloaded
 * @param {string} [toolInfo.docsUrl] - Quire docs URL for this tool's usage
 * @param {string} [toolInfo.fallback] - Alternative suggestion (e.g., use default engine)
 */
export default class ToolNotFoundError extends QuireError {
  constructor(toolName, toolInfo = {}) {
    const displayName = toolInfo.displayName || toolName
    const installUrl = toolInfo.installUrl || 'the tool documentation'
    const docsUrl = toolInfo.docsUrl || `${QuireError.DOCS_BASE}/troubleshooting/`

    let suggestion = `Install ${displayName} from ${installUrl}`
    if (toolInfo.fallback) {
      suggestion += `\n${toolInfo.fallback}`
    }

    super(
      `${displayName} is not installed or not in PATH`,
      {
        code: 'TOOL_NOT_FOUND',
        exitCode: 5,
        suggestion,
        docsUrl,
      }
    )

    this.toolName = toolName
  }
}
