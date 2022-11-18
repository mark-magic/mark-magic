export interface PluginMeta {
  name: string
  readme: string
  install: boolean
}

class StoreApi {
  async list(): Promise<PluginMeta[]> {
    return [
      {
        name: 'joplin',
        readme: '# joplin\n\n这是 joplin 的插件，支持输入和输出',
        install: true,
      },
      {
        name: 'hexo',
        readme: '# hexo\n这是 joplin 的插件，仅支持输出',
        install: false,
      },
    ]
  }
  async install(name: string) {}
  async unInstall(name: string) {}
}

export const storeApi = new StoreApi()
