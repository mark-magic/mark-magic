import { convert } from '@mark-magic/core'
import { loadConfig, parseConfig } from '.'

async function main() {
  // 读取配置文件
  const rootPath = process.cwd()
  const config = await loadConfig(rootPath)
  // 解析插件和配置
  const resolvedConfig = await parseConfig(config)
  // 执行转换
  for (const it of resolvedConfig) {
    console.log(`开始执行任务: ${it.name}`)
    await convert({
      input: it.input.plugin(it.input.config),
      output: it.output.plugin(it.output.config),
    })
  }
}

await main()
