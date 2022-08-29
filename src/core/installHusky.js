import ora from 'ora'
import chalk from 'chalk'
import merge from 'lodash.merge'
import os from 'node:os'

import { getPkgJson, setPkgJson } from '../utils/package.js'
import { execRun } from '../utils/index.js'
import { getConfig } from '../utils/config.js'

const OPERATION = 'husky'
const packageObj = {
  scripts: {
    prepare: 'husky install'
  },
  devDependencies: {
    husky: '^8.0.1'
  }
}

export default async function installCommitzen() {
  const platform = os.platform()
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  if (!platform.startsWith('win')) {
    packageObj['scripts']['postinstallmac'] =
      'git config core.hooksPath .husky && chmod 777 .husky/*'
  }

  const pkgJson = await getPkgJson()
  await setPkgJson(merge({}, pkgJson, packageObj))

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)
  await execRun(
    npmManager === 'yarn'
      ? `${npmManager} prepare`
      : `${npmManager} run prepare`
  )

  if (!platform.startsWith('win')) {
    await execRun('npm run postinstallmac')
  }

  await execRun('npx husky add .husky/pre-commit "npm run lint-staged"')
  await execRun(
    'npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"'
  )

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
