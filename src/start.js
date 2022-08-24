import logger from './utils/logger.js'
import { ensureNpmManager } from './utils/npm.js'

// install
import installESlint from './core/installEslint.js'
import installPrettier from './core/installPrettier.js'
import installStylelint from './core/installStylelint.js'
import installCommitlint from './core/installCommitlint.js'
import installLintStaged from './core/installLintStaged.js'
import installHusky from './core/installHusky.js'
import installCommitzen from './core/installCommitizen.js'
import installEditorConfig from './core/installEditorConfig.js'

export default async function start(options) {
  await ensureNpmManager()

  logger.info('\n 🗒️ 配置列表\n')
  console.table({
    '脚本 lint': 'eslint',
    '脚本 format': 'prettier',
    '样式 lint/format': 'stylelint',
    '提交 lint': 'commitlint',
    'lint-staged': '校验 staged',
    husky: '关联 git 钩子',
    'git-cz': 'commitizen with cz'
  })

  logger.info('\n 🚀🚀🚀 开始配置\n')

  await installEditorConfig(options)
  await installESlint(options)
  await installPrettier(options)
  await installStylelint(options)

  await installCommitlint(options)
  await installLintStaged(options)
  await installHusky(options)
  await installCommitzen(options)

  logger.info('\n 🌻🌻🌻 配置完成\n')
}
