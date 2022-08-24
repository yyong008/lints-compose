import ora from 'ora'
import chalk from 'chalk'
import merge from 'lodash.merge'

import { getPkgJson, setPkgJson } from '../utils/package.js'
import { execRun } from '../utils/index.js'
import { getConfig } from '../utils/config.js'

const OPERATION = 'commitizen'
const packageObj = {
  scripts: {
    commit: 'git add . && cz'
  },
  devDependencies: {
    commitizen: '^4.2.5',
    'cz-conventional-changelog': '^3.3.0'
  },
  config: {
    commitizen: {
      path: './node_modules/cz-conventional-changelog'
    }
  }
}

export default async function installCommitzen(options) {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  const pkgJson = await getPkgJson()
  await setPkgJson(merge({}, pkgJson, packageObj))

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
