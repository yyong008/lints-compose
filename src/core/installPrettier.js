import ora from 'ora'
import chalk from 'chalk'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import merge from 'lodash.merge'

import { getPkgJson, setPkgJson } from '../utils/package.js'
import { genConfigFile } from '../utils/configFile.js'
import { execRun } from '../utils/index.js'
import { getConfig } from '../utils/config.js'

const __dirname = fileURLToPath(import.meta.url)

const OPERATION = 'prettier'
const prettierConfig = {
  semi: false,
  trailingComma: 'none',
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 80,
  tabWidth: 2
}

const packageObj = {
  scripts: {},
  devDependencies: {
    prettier: '^2.7.1'
  }
}

export default async function installPrettier(options) {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  // 依赖
  if (options.eslint) {
    packageObj['devDependencies'] = {
      ...packageObj['devDependencies'],
      'eslint-config-prettier': '^8.5.0',
      'eslint-plugin-prettier': '^4.2.1'
    }
  }

  // npm 脚本
  const pkgJson = await getPkgJson()
  if (options.prettier) {
    packageObj['scripts'] = {
      ...pkgJson['scripts']
    }
  } else {
    packageObj['scripts'] = {
      ...pkgJson['scripts'],
      prettier: 'prettier --write'
    }
  }

  // 配置
  if (options.single) {
    await genConfigFile('.prettierrc', prettierConfig)
    const ign = await fsp.readFile(
      path.join(__dirname, '../../tpls/_prettierignore'),
      'utf8'
    )
    await genConfigFile('.prettierignore', ign, false)
  } else {
    packageObj['prettier'] = prettierConfig
  }

  await setPkgJson(merge({}, pkgJson, packageObj))

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
