import { RouteConfig } from '@liuli-util/react-router'
import { LayoutView } from '../views/layout/LayoutView'
import { ContentView } from '../views/content/ContentView'
import markdowns from '~react-pages'
import { treeMap } from '@liuli-util/tree'
import pathe from 'pathe'
import { groupBy, last } from 'lodash-es'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: LayoutView,
    children: [
      {
        path: '/*',
        component: ContentView,
      },
    ],
  },
]

export const contents = treeMap(
  markdowns,
  (it, path) => {
    const routePath = '/' + pathe.join(...path)
    if (it.children) {
      const { true: index, false: subs } = groupBy(it.children, (it) =>
        ['readme', 'index'].includes((it.path as string).toLowerCase()),
      )
      if (!index) {
        throw new Error(`必须包含 readme 或者 index 文件: ${it.path}`)
      }
      return {
        ...it,
        importPath: './' + pathe.join('./assets/books/', ...path, index[0].path + '.md'),
        routePath,
        children: subs,
      }
    }
    return {
      ...it,
      routePath,
      importPath: './' + pathe.join('./assets/books/', ...path.slice(0, -1), last(path) + '.md'),
    }
  },
  {
    id: 'path',
    children: 'children',
  },
)
