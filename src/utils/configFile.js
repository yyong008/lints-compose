import fsp from 'node:fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * 根目录：写配置文件
 */
export async function genConfigFile(
  fileneme,
  contentObj,
  normalizeContent = true
) {
  await fsp
    .writeFile(
      `${process.cwd()}/${fileneme}`,
      normalizeContent ? JSON.stringify(contentObj, null, 2) : contentObj,
      'utf-8'
    )
    .catch((e) => {
      throw new Error(e)
    })
}

export async function genConfigIgnoreFileByName(filename) {
  const ignoreFileName = '_' + filename.slice(1)
  const content = await fsp.readFile(
    `${__dirname}/../tpls/${ignoreFileName}`,
    'utf-8'
  )

  await fsp.writeFile(`${process.cwd()}/${filename}`, content).catch((e) => {
    throw new Error(e)
  })
}
