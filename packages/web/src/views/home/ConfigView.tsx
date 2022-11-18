import { GetConfigParam, MamiPlugin, SetConfigParam } from '@mami/server'
import { Select } from 'antd'
import { Schema } from 'jsonschema'
import { useState } from 'react'
import { useAsync } from 'react-use'
import { ajaxClient } from '../../constants/api'
import { ConfigRenderer } from './components/ConfigRenderer'

export function ConfigView(props: { type: 'input' | 'output'; onNext(plugin: string, config: object): void }) {
  const list = useAsync(async () => {
    return await ajaxClient.get<MamiPlugin[]>('/api/list', { type: props.type })
  })
  const [plugin, setPlugin] = useState<MamiPlugin>()
  const [config, setConfig] = useState<object>({})
  async function onChangePlugin(name: string) {
    setPlugin(list.value!.find((item) => item.name === name)!)
    setConfig(await ajaxClient.get('/api/config', { name, type: props.type } as GetConfigParam))
  }
  async function onSave(values: object) {
    console.log('onSave: ', values)
    setConfig(values)
    await ajaxClient.post('/api/config', {
      name: plugin?.name,
      type: props.type,
      value: values,
    } as SetConfigParam)
    props.onNext(plugin!.name, values)
  }
  return (
    <>
      {list.value && (
        <div>
          <Select
            style={{ width: '20em' }}
            placeholder={'选择插件'}
            options={list.value.map((item) => ({
              label: item.name,
              value: item.name,
            }))}
            value={plugin?.name}
            onChange={onChangePlugin}
          />
          {plugin && (
            <ConfigRenderer
              plugin={{
                name: plugin?.name,
                type: props.type,
                config: plugin[props.type] as Schema,
              }}
              value={config}
              onChange={onSave}
            />
          )}
        </div>
      )}
    </>
  )
}
