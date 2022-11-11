import css from './PluginSidebar.module.css'
import { Schema } from 'jsonschema'
import { List, Select } from 'antd'

export interface PluginMeta {
  name: string
  type: 'input' | 'output'
  config: Schema
}

function PluginList(props: { data: PluginMeta[]; onClick(data: PluginMeta): void }) {
  return (
    <ul>
      {props.data.map((item) => (
        <li key={item.name} onClick={() => props.onClick(item)}>
          {item.name}
        </li>
      ))}
    </ul>
  )
}

export function PluginSidebar(props: {
  input: PluginMeta[]
  output: PluginMeta[]
  onSelect(plugin: PluginMeta): void
}) {
  return (
    <div className={css.sidebar}>
      <section>
        <h2>input plugin</h2>
        <PluginList data={props.input} onClick={props.onSelect} />
      </section>
      <section>
        <h2>output plugin</h2>
        <PluginList data={props.output} onClick={props.onSelect} />
      </section>
    </div>
  )
}
