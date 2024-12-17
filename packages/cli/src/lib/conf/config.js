import Conf from 'conf'
import defaults from './defaults.js'
import migrations from './migrations.js'
import packageConfig from '#src/packageConfig.js'
import schema from './schema.js'

const { name, version } = packageConfig

const beforeEachMigration = (store, context) => {
  const { fromVersion, toVersion } = context
  console.info(`quire-cli migrating config from ${fromVersion} → ${toVersion}`)
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
