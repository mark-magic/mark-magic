import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import JSZip from 'jszip'
import { pathExists } from '@liuli-util/fs'

/**
 * 提取 zip 文件到指定文件夹
 * @param zip
 * @param folderPath
 */
export async function extractZipToFolder(zip: JSZip, folderPath: string): Promise<void> {
  let promises: (() => Promise<any>)[] = []
  zip.forEach((relativePath, zipEntry) => {
    let outputPath = path.join(folderPath, relativePath)
    if (zipEntry.dir) {
      promises.push(async () => {
        if (!(await pathExists(outputPath))) {
          await mkdir(outputPath, { recursive: true })
        }
      })
    } else {
      promises.push(async () => {
        const dirPath = path.dirname(outputPath)
        if (!(await pathExists(dirPath))) {
          await mkdir(path.dirname(outputPath), { recursive: true })
        }
        await writeFile(outputPath, await zip.file(relativePath)!.async('nodebuffer'))
      })
    }
  })
  await Promise.all(promises.map((it) => it()))
}
