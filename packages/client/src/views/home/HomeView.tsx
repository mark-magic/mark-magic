import { useMemo, useState } from 'react'
import { ConfigRenderer } from './components/ConfigRenderer'
import { PluginMeta, PluginSidebar } from './components/PluginSidebar'
import css from './HomeView.module.css'
import joplinSchema from './assets/joplin.schema.json'
import hexoSchema from './assets/hexo.schema.json'

export function HomeView() {
  const [current, setCurrent] = useState<PluginMeta>()
  const [config, setConfig] = useState<Record<string, object>>({})
  function onSelect(plugin: PluginMeta) {
    console.log('onSelect: ', plugin)
    setCurrent(plugin)
  }
  const key = useMemo(() => (current ? current.type + '-' + current.name : ''), [current])
  function onChange(values: object) {
    setConfig({ [key]: { ...config[key], ...values } })
  }
  return (
    <div className={css.app}>
      <PluginSidebar
        input={[joplinSchema].map((item) => ({ name: item.$id, type: 'input', config: item }))}
        output={[hexoSchema].map((item) => ({ name: item.$id, type: 'output', config: item }))}
        onSelect={onSelect}
      />
      {current && <ConfigRenderer plugin={current} value={config[key] ?? {}} onChange={onChange} />}
    </div>
  )
}
