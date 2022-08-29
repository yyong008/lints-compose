import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import ora from 'ora'
import chalk from 'chalk'

import { genConfigFile } from '../utils/configFile.js'

const __dirname = fileURLToPath(import.meta.url)
const OPERATION = 'editorconfig'

export default async function installEditorConfig() {
  const spinner = ora({
    color: 'green',
    text: chalk.blue(`🎡start ${OPERATION} config...\n`)
  }).start()

  spinner.start(chalk.blue(`开始配置 ${OPERATION}...`))
  const ign = await fsp.readFile(
    path.join(__dirname, '../../tpls/_editorconfig'),
    'utf8'
  )

  await genConfigFile('.editorconfig', ign, false)

  spinner.succeed(chalk.green(`🎡 配置 ${OPERATION} 成功...`))
  spinner.stop()
}
