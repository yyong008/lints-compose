import ora from 'ora'
import chalk from 'chalk'
import merge from 'lodash.merge'

import { getPkgJson, setPkgJson } from '../utils/package.js'
import {
  genConfigFile,
  genConfigIgnoreFileByName
} from '../utils/configFile.js'
import { execRun } from '../utils/index.js'
import { getConfig } from '../utils/config.js'

const OPERATION = 'stylelint'
const packageObj = {
  scripts: {
    stylelint: 'stylelint ./src/**/*.{css,less,scss,sass}',
    'stylelint:fix': 'stylelint ./src/**/*.{css,less,scss,sass} --fix'
  },
  devDependencies: {
    stylelint: '^14.10.0'
  }
}

const stylelintConfig = {
  extends: ['stylelint-prettier/recommended']
}

export default async function installStylelint(options) {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  if (options.single) {
    await genConfigFile('.stylelintrc', stylelintConfig)
    await genConfigIgnoreFileByName('.stylelintignore')
  } else {
    packageObj['stylelint'] = stylelintConfig
  }

  const pkgJson = await getPkgJson()
  await setPkgJson(merge({}, pkgJson, packageObj))

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
