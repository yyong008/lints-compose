import { execSync } from 'child_process'
import { readPkg, writePkg } from './utils/index.js'
import logger from './utils/logger.js'
import ora from 'ora'

export default async function reset() {
  const spinner = ora({
    color: 'red',
    text: '开移除配置'
  }).start()

  const configFiles = [
    '.commitlintrc',
    '.editorconfig',
    '.eslintrc',
    '.eslintignore',
    '.lintstagedrc',
    '.prettierrc',
    '.prettierignore',
    '.stylelintrc',
    '.stylelintignore',
    '.commitlintrc',
    '.husky'
  ]

  const filesStr = configFiles.reduce((acc, p) => acc + ' ' + p)

  spinner.start('移除删除配置文件...')
  execSync(`rm -rf ../${filesStr}`)
  spinner.succeed('移除删除配置文件成功!')

  const pkgJson = readPkg()
  const delScripts = [
    'lint',
    'lint:fix',
    'lint-staged',
    'prepare',
    'postinstallmac',
    'commit',
    'stylelint',
    'stylelint:fix'
  ]

  spinner.start('移除 npm 脚本...')
  delScripts.forEach((script) => {
    delete pkgJson['scripts'][script]
  })
  spinner.succeed('移除 npm 脚本成功!')

  spinner.start('移除 npm 依赖...')
  const delDevPackages = [
    'eslint',
    'typescript',
    '@typescript-eslint/parser',
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'stylelint',
    'stylelint-config-prettier',
    'stylelint-prettier',
    '@commitlint/cli',
    '@commitlint/config-conventional',
    'lint-staged',
    'husky',
    'commitizen',
    'cz-conventional-changelog'
  ]

  delDevPackages.forEach((pk) => {
    if (pkgJson['devDependencies'] && pkgJson['devDependencies'][pk]) {
      delete pkgJson['devDependencies'][pk]
    }
  })

  const devDepLen = Object.keys(pkgJson['devDependencies'] || {}).length

  if (devDepLen <= 0) {
    delete pkgJson['devDependencies']
  }
  spinner.succeed('移除 npm 依赖成功！')

  spinner.start('移除 config 配置...')
  // 删除 package.json config
  const delConfigs = ['commitizen']

  delConfigs.forEach((configName) => {
    if (pkgJson['config'] && pkgJson['config'][configName]) {
      delete pkgJson['config'][configName]
    }
  })

  const devConfigLen = Object.keys(pkgJson['config'] || {}).length

  if (devConfigLen <= 0) {
    delete pkgJson['config']
  }
  spinner.succeed('移除 config 配置成功！')

  writePkg(pkgJson)

  logger.info('\n 重置配置成功 \n')

  spinner.stop()
}
