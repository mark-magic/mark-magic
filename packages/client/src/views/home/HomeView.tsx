import css from './HomeView.module.css'
import { Button, Card, Steps } from 'antd'
import { useState } from 'react'
import { ConfigView } from './ConfigView'
import { ajaxClient } from '../../constants/api'
import { ExecuteOptions } from '@mami/server'

function ExecuteView(props: { config: ExecuteOptions }) {
  async function onRun() {
    await ajaxClient.post('/api/execute', props.config)
  }
  return (
    <Card>
      <Button type={'primary'} onClick={onRun}>
        运行
      </Button>
    </Card>
  )
}

export function HomeView() {
  const [current, setCurrent] = useState(0)
  const [executeOptions, setExecuteOptions] = useState<Partial<ExecuteOptions>>({})
  return (
    <div className={css.HomeView}>
      <Steps current={current}>
        <Steps.Step title={'输入源'} />
        <Steps.Step title={'输出源'} />
        <Steps.Step title={'运行'} />
      </Steps>
      <div className={css.container}>
        {current === 0 && (
          <ConfigView
            key={current}
            type={'input'}
            onNext={(name, config) => {
              setExecuteOptions({ input: { name, config } })
              setCurrent(1)
            }}
          />
        )}
        {current === 1 && (
          <ConfigView
            key={current}
            type={'output'}
            onNext={(name, config) => {
              setExecuteOptions({ ...executeOptions, output: { name, config } })
              setCurrent(2)
            }}
          />
        )}
        {current === 2 && <ExecuteView config={executeOptions as ExecuteOptions} />}
      </div>
    </div>
  )
}
