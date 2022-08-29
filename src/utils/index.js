import fs from 'node:fs'
import logger from './logger.js'
import { execSync, exec } from 'child_process'
import { getConfig } from './config.js'
import { promisify } from 'node:util'

const pkgPath = (root) => {
  return `${root ? root : process.cwd()}/package.json`
}

/**
 * 读取 package.json
 * @returns
 */
export function readPkg() {
  const pkgStr = fs.readFileSync(pkgPath(), 'utf-8')
  const pkg = JSON.parse(pkgStr)
  return pkg
}

export function writePkg(pkg) {
  fs.writeFileSync(pkgPath(), JSON.stringify(pkg, null, 2))
}

/**
 * 写 npm 脚本
 * @param {*} scriptName
 * @param {*} scriptCommand
 */
export function writeScripts(scriptName, scriptCommand) {
  const pkg = readPkg()
  const { scripts } = pkg

  if (!(scriptName in scripts)) {
    scripts[scriptName] = scriptCommand
  } else {
    logger.warn(`${scriptName} 已经存在！`)
  }

  fs.writeFileSync(pkgPath(), JSON.stringify(pkg, null, ' '))
}

/**
 * 书写 package.json 的依赖
 * dev
 * 和非 dev
 */
export function writePackage(
  dep = 'devDependencies',
  packageName,
  packageVersion
) {
  if (!packageName || !packageVersion) {
    throw new Error('writePackage error, check params')
  }
  const pkg = readPkg()

  if (!pkg[dep]) {
    pkg[dep] = {}
  }

  if (!(packageName in pkg[dep])) {
    pkg[dep][packageName] = packageVersion
  } else {
    logger.warn(`${packageName}: ${packageVersion} 已经存在！`)
  }

  fs.writeFileSync(pkgPath(), JSON.stringify(pkg, null, ' '))
}

/**
 * package.json 第一层对象
 * @param {*} configName
 * @param {*} config
 */
export function writeConfig(configName, config) {
  if (!configName || !config) {
    throw new Error('writeConfig error, check params')
  }
  const pkg = readPkg()

  if (!pkg[configName]) {
    pkg[configName] = {}
  }

  if (!(configName in pkg[configName])) {
    pkg[configName] = config
  } else {
    console.log(`${configName} 已经存在！`)
  }

  fs.writeFileSync(pkgPath(), JSON.stringify(pkg, null, ' '))
}

/**
 * packages.json config 配置项
 * @param {*} configName
 * @param {*} config
 */
export function writeConfigInPkg(configName, config) {
  const pkg = readPkg()

  if (!pkg['config']) {
    pkg['config'] = {}
  }

  pkg['config'][configName] = config
  fs.writeFileSync(pkgPath(), JSON.stringify(pkg, null, ' '))
}

/**
 * 根目录：写配置文件
 */
export function writeConfigFile(fileneme, content) {
  fs.writeFileSync(`${process.cwd()}/${fileneme}`, content)
}

export function normalizeOptions(options) {
  // if (getNpmManagerFromUserAgent(process.env)) return options
}

/**
 * 异步运行
 * @param {*} commander
 */
export async function execRun(command) {
  // await new Promise((resolve, reject) => {
  //   exec(`${command}`, (error, stdout, stderr) => {
  //     debugger
  //     if (error) {
  //       console.error(`exec error: ${error}`);
  //       return;
  //     }
  //     console.log(`stdout: ${stdout}`);
  //     console.error(`stderr: ${stderr}`);
  //   }
  //   )
  // })
  await promisify(exec)(command)
}

export async function execNpmRun(npmCommand) {
  const { npmManager } = getConfig()
  new Promise((resolve, reject) => {
    execSync(npmManager === 'yarn' ? 'yarn' : `${npmManager} run`, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}
