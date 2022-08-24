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

const OPERATION = 'eslint'
const packageObj = {
  scripts: {
    lint: 'eslint --ext .ts,.js,.tsx,.jsx .',
    'lint:fix': 'eslint --ext .ts,.js,.tsx,.jsx . --fix'
  },
  devDependencies: {
    eslint: '^8.22.0'
  }
}

const eslintConfing = {
  env: {},
  extends: ['eslint:recommended']
}

const eslintConfingWithTypeScript = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {}
}

export default async function installESLint(options) {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))

  const { devDependencies = {}, dependencies = {} } = await getPkgJson()

  if (options.typescript) {
    if (!('typescript' in devDependencies) && !('typescript' in dependencies)) {
      packageObj.devDependencies['typescript'] = '^4.7.4'
    }
    packageObj.devDependencies = {
      ...packageObj.devDependencies,
      '@typescript-eslint/parser': '^5.33.1',
      '@typescript-eslint/eslint-plugin': '^5.33.1'
    }

    if (options.prettier) {
      eslintConfingWithTypeScript.extends.push('plugin:prettier/recommended')
    }
  } else {
    if (options.prettier) {
      eslintConfing.extends.push('plugin:prettier/recommended')
    }
  }

  if (!options.single) {
    packageObj['eslint'] = options.typescript
      ? eslintConfingWithTypeScript
      : eslintConfing
  }

  const pkgJson = await getPkgJson()
  await setPkgJson(merge({}, pkgJson, packageObj))

  if (options.single) {
    await genConfigFile(
      '.eslintrc',
      options.typescript ? eslintConfingWithTypeScript : eslintConfing
    )
    await genConfigIgnoreFileByName('.eslintignore')
  }

  const { npmManager } = getConfig()
  await execRun(npmManager === 'yarn' ? 'yarn' : `${npmManager} install`)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
