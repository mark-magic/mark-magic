import { Observer, useLocalObservable } from 'mobx-react-lite'
import ReactMarkdown from 'react-markdown'
import { useMount } from 'react-use'
import { PluginMeta, storeApi } from './api/StoreApi'
import css from './StoreView.module.css'

export function StoreView() {
  const state = useLocalObservable(() => ({
    preview: '',
    list: [] as PluginMeta[],
    async refresh() {
      this.list = await storeApi.list()
    },
    async install(item: PluginMeta) {
      await storeApi.install(item.name)
      const i = this.list.indexOf(item)
      this.list[i].install = true
    },
    async unInstall(item: PluginMeta) {
      await storeApi.unInstall(item.name)
      const i = this.list.indexOf(item)
      this.list[i].install = false
    },
  }))
  useMount(state.refresh)
  return (
    <Observer>
      {() => (
        <div className={css.StoreView}>
          <section className={css.nav}>
            <h2>store</h2>
            <ul className={css.list}>
              {state.list.map((item) => (
                <li key={item.name}>
                  <span onClick={() => (state.preview = item.readme)}>{item.name}</span>
                  {item.install ? (
                    <button onClick={() => state.unInstall(item)}>卸载</button>
                  ) : (
                    <button onClick={() => state.install(item)}>安装</button>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <ReactMarkdown>{state.preview}</ReactMarkdown>
          </section>
        </div>
      )}
    </Observer>
  )
}
