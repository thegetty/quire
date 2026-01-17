import Conf from 'conf'
import packageConfig from '#src/packageConfig.js'
import defaults from './defaults.js'
import migrations from './migrations.js'
import schema from './schema.js'

const { name, version } = packageConfig

const beforeEachMigration = (_store, context) => {
  const { fromVersion, toVersion } = context
  // Call console directly to avoid circular dependency (logger imports config)
  // Migration messages are rare, so the simpler formatting is acceptable
  console.info(`[quire] Migrating config from ${fromVersion} → ${toVersion}`)
}

/**
 * Create quire-cli configuration instance
 * @see https://github.com/sindresorhus/conf#confoptions
 *
 * @todo support yaml configuration files
 * https://github.com/sindresorhus/conf?tab=readme-ov-file#can-i-use-yaml-or-another-serialization-format
 *
 * @type       {Conf}
 */
const config = new Conf({
  beforeEachMigration,
  clearInvalidConfig: true,
  defaults,
  migrations,
  projectName: name,
  projectSuffix: '',
  projectVersion: version,
  schema,
  watch: true,
})

export default config
