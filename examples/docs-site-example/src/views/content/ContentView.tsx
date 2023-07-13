import { useRouter } from '@liuli-util/react-router'
import React, { useState } from 'react'
import { treeToList } from '@liuli-util/tree'
import { useAsync } from 'react-use'
import { contents } from '../../constants/router'
import { keyBy } from 'lodash-es'

export const ContentView: React.FC = () => {
  const router = useRouter()
  const [html, setHtml] = useState('')
  useAsync(async () => {
    const routeMap = keyBy(
      treeToList(contents, {
        id: 'path',
        children: 'children',
        path: '__path',
      }),
      (it) => it.routePath as string,
    )
    const route = routeMap[decodeURI(router.location.pathname)]
    // console.log(router.location.pathname, route)
    if (!route) {
      throw new Error('没有找到对应的路由' + router.location.pathname)
    }
    setHtml((await import(route.importPath)).default)
  }, [router.location.pathname])
  return (
    <div>
      <div
        className={'prose mx-auto dark:prose-dark'}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>
    </div>
  )
}
