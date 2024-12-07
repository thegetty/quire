import Conf from 'conf'
import defaults from './defaults.js'
import migrations from './migrations.js'
import schema from './schema.js'
import packageConfig from '#root/package.json' assert { type: 'json' }

const { name, version } = packageConfig

const beforeEachMigration = (store, context) => {
  const { fromVersion, toVersion } = context
  console.info(`[CLI] migrating config from ${fromVersion} → ${toVersion}`)
}

/**
 * Create quire-cli configuration instance
 * @see https://github.com/sindresorhus/conf#confoptions
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

if (process.env.DEBUG) {
  console.debug(`[CLI:config] ${config.path}`)
}

export default config
