// import { getNpmManagerFromUserAgent } from "./index.js";
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import inquirer from 'inquirer'
import { setConfig } from './config.js'

export async function ensureNpmManager() {
  let { name } = getNpmManagerFromUserAgent(process.env.npm_config_user_agent)
  if (name) {
    setConfig('npmManager', name)
    return name
  }
  // lockfile
  const managers = Promise.all([
    await checkIsNpmManagerLockFile('package-lock.json'),
    await checkIsNpmManagerLockFile('yarn.lock'),
    await checkIsNpmManagerLockFile('pnpm-lock.yaml')
  ])
  // 手动
  managers.forEach((isMananger, index) => {
    if (isMananger) {
      if (index === 0) name = 'npm'
      if (index === 1) name = 'yarn'
      if (index === 2) name = 'pnpm'
    }
  })

  if (name) {
    setConfig('npmManager', name)
    return name
  }

  name = await (await customNpmManager()).name
  setConfig('npmManager', name)

  return name
}

export function getNpmManagerFromUserAgent(userAgent) {
  if (!userAgent) {
    return { name: null, version: null }
  }
  const pkgSpec = userAgent.split(' ')[0]
  const [name, version] = pkgSpec.split('/')
  return {
    name,
    version
  }
}

export async function checkIsNpmManagerLockFile(lockfile) {
  return await fsp
    .access(`${process.cwd()}/${lockfile}`, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
}

/**
 * 选择一个 npm 管理工具
 * @returns
 */
export async function customNpmManager() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: '选择一个包管理工具',
      choices: [
        {
          name: 'npm'
        },
        {
          name: 'yarn'
        },
        {
          name: 'pnpm'
        }
      ]
    }
  ])

  return {
    name: answer.manager
  }
}
