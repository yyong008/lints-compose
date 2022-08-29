import fsp from 'node:fs/promises'
import fs from 'node:fs'
import inquirer from 'inquirer'

import { execRun } from './index.js'
import logger from './logger.js'

export async function checkIsGitInThisRepo() {
  return await fsp
    .access(process.cwd() + '/.git', fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

export async function checkAndInitGitRepo() {
  let hasGitInited = await checkIsGitInThisRepo()

  if (!hasGitInited) {
    const answer = await inquirer.prompt([
      {
        name: 'git',
        type: 'confirm',
        message: '初始化 git 吗？',
        choices: [
          {
            name: 'yes'
          }
        ]
      }
    ])

    if (answer.git) {
      await execRun('git init')
      logger.info('git init ok')
      hasGitInited = true
    } else {
      hasGitInited = false
    }
  }

  return hasGitInited
}
