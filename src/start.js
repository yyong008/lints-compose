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

  logger.info('\n ๐๏ธ ้็ฝฎๅ่กจ\n')
  console.table({
    '่ๆฌ lint': 'eslint',
    '่ๆฌ format': 'prettier',
    'ๆ ทๅผ lint/format': 'stylelint',
    'ๆไบค lint': 'commitlint',
    'lint-staged': 'ๆ ก้ช staged',
    husky: 'ๅณ่ git ้ฉๅญ',
    'git-cz': 'commitizen with cz'
  })

  logger.info('\n ๐๐๐ ๅผๅง้็ฝฎ\n')

  await installEditorConfig(options)
  await installESlint(options)
  await installPrettier(options)
  await installStylelint(options)

  await installCommitlint(options)
  await installLintStaged(options)
  await installHusky(options)
  await installCommitzen(options)

  logger.info('\n ๐ป๐ป๐ป ้็ฝฎๅฎๆ\n')
}
