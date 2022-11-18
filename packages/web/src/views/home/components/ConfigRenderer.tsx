import { Button, Card, Form, Input, Select } from 'antd'
import { Schema } from 'jsonschema'
import { useMemo } from 'react'
import { PluginMeta } from './PluginSidebar'

function ItemRender(props: { k: string; item: Schema }) {
  if (props.item.type === 'string') {
    if (props.item.enum) {
      const desc = (props.item as any).enumDescriptions as string[]
      return (
        <Select
          options={(props.item.enum as (string | number)[]).map((item, i) =>
            desc ? { label: desc[i], value: item } : { value: item },
          )}
          allowClear={true}
          defaultValue={(props.item as any).default}
        />
      )
    }
    return <Input defaultValue={(props.item as any).default} />
  }
  throw new Error('dont render item ' + props.k)
}

export function ConfigRenderer(props: { plugin: PluginMeta; value: object; onChange(config: object): void }) {
  const meta = props.plugin.config
  const [form] = Form.useForm()
  async function onSave(values: object) {
    props.onChange(values)
  }
  const requiredKeys = useMemo(() => (meta.required ?? []) as string[], [meta.required])
  return (
    <Card>
      <Form form={form} onFinish={onSave} layout={'vertical'}>
        {Object.entries(meta.properties!).map(([k, v]) => (
          <Form.Item key={k} name={k} label={v.description} rules={[{ required: requiredKeys.includes(k) }]}>
            {ItemRender({ k, item: v })}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type={'primary'} htmlType={'submit'}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
