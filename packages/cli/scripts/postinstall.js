import chalk from 'chalk'

// @todo use an i18n string for the documentation url
const docsUrl = 'https://quire.getty.edu/docs/quire-cli/'

const showSuccessMessage = () => {
  const heading = chalk.inverse.green('Success!')
  const messsage = chalk.magenta(
    'Quire CLI installed! Please visit ',
    chalk.underline(docsUrl),
    ' for more information.'
  )
  console.log(heading, messsage)
}

try {
  // check if the cli is a global installation of quire-cli
  const npmArgs = JSON.parse(process.env['npm_config_argv'])
  if (npmArgs.cooked && npmArgs.cooked.includes('--global')) {
    showSuccessMessage()
    // @todo run `quire-cli --help` on success
    // cli('--help')
  }
} catch (error) {
  // snafu
}
