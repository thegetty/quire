import { execa } from 'execa'

export default {
  /**
   * A wrapper module for the Eleventy CLI
   * @see https://www.11ty.dev/docs/usage/#command-line-usage
   *
   * Q: Should we run the 11ty pcakage build scripts?
   *
   *   import { scripts: { build }} from '11ty/package.json'
   *   execaCommand(build)
   */
  build: () => {
    const configFile = '.eleventy.js'

    const paths = {
      input: '.',
      output: '_site'
    }

    const options = [
      `--config=${configFile}`,
      `--input=${input}`,
      `--output=${output}`,
      `--incremental`
    ]

    execa('npx @11ty/eleventy', options).stdout.pipe(process.stdout)
  }
}
