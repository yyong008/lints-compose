import ora from 'ora'
import chalk from 'chalk'
import merge from 'lodash.merge'

import { getPkgJson, setPkgJson } from '../utils/package.js'
import { genConfigFile } from '../utils/configFile.js'
import { execRun } from '../utils/index.js'
import { getConfig } from '../utils/config.js'

const OPERATION = 'lint-staged'
const configFileName = '.lintstagedrc'
const packageObj = {
  scripts: {
    'lint-staged': 'lint-staged'
  },
  devDependencies: {
    'lint-staged': '^13.0.3'
  }
}

const lintStagedConfig = {
  '**/*.{ts, tsx, js, jsx}': ['npm run lint'],
  'src/**/*.{css,less,sass,scss}': ['npm run stylelint'],
  '*.md': ['prettier --write']
}

export default async function installLintStaged(options) {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  const pkgJson = await getPkgJson()
  await setPkgJson(merge({}, pkgJson, packageObj))

  if (options.single) {
    await genConfigFile(`${configFileName}`, lintStagedConfig)
  }

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
