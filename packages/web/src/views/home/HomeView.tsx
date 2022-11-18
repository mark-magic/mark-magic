import css from './HomeView.module.css'
import { Button, Card, message, Steps } from 'antd'
import { Reducer, useReducer, useState } from 'react'
import { ConfigView } from './ConfigView'
import { ajaxClient } from '../../constants/api'
import { ExecuteOptions } from '@mami/server'
import { useAsyncFn } from 'react-use'

function ExecuteView(props: { config: ExecuteOptions }) {
  const [runState, onRun] = useAsyncFn(async function () {
    await ajaxClient.post('/api/execute', props.config)
    message.success('转换完成')
  })

  return (
    <Card>
      <Button type={'primary'} onClick={onRun} loading={runState.loading}>
        运行
      </Button>
    </Card>
  )
}

export function HomeView() {
  const [step, dispatch] = useReducer<Reducer<{ current: number; max: number }, number>>(
    (s, a) => ({
      current: a,
      max: Math.max(s.max, a),
    }),
    { current: 0, max: 0 },
  )
  const [executeOptions, setExecuteOptions] = useState<Partial<ExecuteOptions>>({})
  return (
    <div className={css.HomeView}>
      <Steps
        items={[{ title: '输入源' }, { title: '输出源' }, { title: '运行' }]}
        current={step.current}
        onChange={(v) => {
          if (v <= step.max) {
            dispatch(v)
          }
        }}
      />
      <div className={css.container}>
        {step.current === 0 && (
          <ConfigView
            key={step.current}
            type={'input'}
            onNext={(name, config) => {
              setExecuteOptions({ input: { name, config } })
              dispatch(1)
            }}
          />
        )}
        {step.current === 1 && (
          <ConfigView
            key={step.current}
            type={'output'}
            onNext={(name, config) => {
              setExecuteOptions({ ...executeOptions, output: { name, config } })
              dispatch(2)
            }}
          />
        )}
        {step.current === 2 && <ExecuteView config={executeOptions as ExecuteOptions} />}
      </div>
    </div>
  )
}
