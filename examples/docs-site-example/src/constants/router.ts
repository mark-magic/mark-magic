import { RouteConfig } from '@liuli-util/react-router'
import { LayoutView } from '../views/layout/LayoutView'
import { treeToList } from '@liuli-util/tree'

export interface SidebarRouteConfig extends Omit<RouteConfig, 'children'> {
  meta: {
    title: string
  }
  children?: SidebarRouteConfig[]
}

export const contentRoutes: SidebarRouteConfig[] = [
  {
    path: '/',
    component: () => import('../views/content/assets/books/README.md'),
    meta: {
      title: '魔法少女小圆 飞向星空',
    },
  },
  {
    path: '/01',
    component: () => import('../views/content/assets/books/01/readme.md'),
    children: [
      {
        path: '/01/001-第一章-许愿',
        component: () => import('../views/content/assets/books/01/001-第一章-许愿.md'),
        meta: {
          title: '第一章-许愿',
        },
      },
    ],
    meta: {
      title: '第一卷-量子纠缠',
    },
  },
  {
    path: '/03',
    component: () => import('../views/content/assets/books/03/readme.md'),
    children: [
      {
        path: '/03/033-幕间-2-小玛德莱娜',
        component: () => import('../views/content/assets/books/03/033-幕间-2-小玛德莱娜.md'),
        meta: {
          title: '幕间-2-小玛德莱娜',
        },
      },
    ],
    meta: {
      title: '第三卷-存在悖论',
    },
  },
  {
    path: '/99',
    component: () => import('../views/content/assets/books/99/readme.md'),
    children: [
      {
        path: '/99/001-背景时间线',
        component: () => import('../views/content/assets/books/99/001-背景时间线.md'),
        meta: {
          title: '背景时间线',
        },
      },
    ],
    meta: {
      title: '番外',
    },
  },
]

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: LayoutView,
    children: treeToList(contentRoutes, { id: 'path', children: 'children', path: '__path' }),
  },
]

// const contents = treeMap(
//   markdowns,
//   (it, path) => {
//     const routePath = '/' + pathe.join(...path)
//     if (it.children) {
//       const { true: index, false: subs } = groupBy(it.children, (it) =>
//         ['readme', 'index'].includes((it.path as string).toLowerCase()),
//       )
//       if (!index) {
//         throw new Error(`必须包含 readme 或者 index 文件: ${it.path}`)
//       }
//       return {
//         ...it,
//         importPath: './' + pathe.join('./assets/books/', ...path, index[0].path + '.md'),
//         routePath,
//         children: subs,
//       }
//     }
//     return {
//       ...it,
//       routePath,
//       importPath: './' + pathe.join('./assets/books/', ...path.slice(0, -1), last(path) + '.md'),
//     }
//   },
//   {
//     id: 'path',
//     children: 'children',
//   },
// )

// console.log(
//   treeMap(
//     contents,
//     (it) =>
//       ({
//         path: it.routePath === '/README' ? '/' : it.routePath,
//         component: `../views/content${it.importPath.slice(1)}` as any,
//         children: it.children,
//         meta: {
//           title: it.path,
//         },
//       } as SidebarRouteConfig),
//     { id: 'id', children: 'children' },
//   ),
// )
