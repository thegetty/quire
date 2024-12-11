import { fileURLToPath } from 'node:url'
import Conf from 'conf'
import defaults from './defaults.js'
import fs from 'node:fs'
import migrations from './migrations.js'
import path from 'node:path'
import schema from './schema.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packagePath = path.join(__dirname, 'package.json')
const packageConfig = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

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
