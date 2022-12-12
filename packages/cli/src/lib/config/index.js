import { Conf } from 'conf'
import defaults from './defaults.js'
import migrations from './migrations.js'
import schema from './schema.js'

const beforeEachMigration = (store, context) => {
  const { fromVersion, toVersion } = context
  console.info(`[CLI] migrating config from ${fromVersion} → ${toVersion}`)
}

const config = new Conf({
  beforeEachMigration,
  clearInvalidConfig: true,
  defaults,
  migrations,
  schema,
})

export default config
