interface PluginConfig {
  name: string
  input?: object
  output?: object
}

const configs: PluginConfig[] = [
  {
    name: '@mami/plugin-joplin',
  },
  {
    name: '@mami/plugin-hexo',
  },
]

export interface SetConfigParam {
  name: string
  type: 'input' | 'output'
  value: object
}

export function setConfig(options: SetConfigParam) {
  const i = configs.findIndex((item) => item.name === options.name)
  if (i === -1) {
    configs.push({
      name: options.name,
      [options.type]: options.value,
    })
    return
  }
  configs[i][options.type] = options.value
}

export interface GetConfigParam {
  name: string
  type: 'input' | 'output'
}

export function getConfig(options: { name: string; type: 'input' | 'output' }) {
  const r = configs.find((item) => item.name === options.name)?.[options.type]
  return r ?? {}
}
