import ora from 'ora'
import chalk from 'chalk'
import merge from 'lodash.merge'

import { getPkgJson, setPkgJson } from '../utils/package.js'
import { genConfigFile } from '../utils/configFile.js'
import { execRun } from '../utils/index.js'
import { getConfig } from '../utils/config.js'

const OPERATION = 'commitlint'
const configFileName = '.commitlintrc'
const commitlintConfig = { extends: ['@commitlint/config-conventional'] }
const packageObj = {
  devDependencies: {
    '@commitlint/cli': '^17.0.3',
    '@commitlint/config-conventional': '^17.0.3'
  }
}

export default async function installCommitlint(options) {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  const pkgJson = await getPkgJson()

  if (!options.single) {
    packageObj[OPERATION] = commitlintConfig
  }
  await setPkgJson(merge({}, pkgJson, packageObj))

  if (options.single) {
    await genConfigFile(`${configFileName}`, commitlintConfig)
  }

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
