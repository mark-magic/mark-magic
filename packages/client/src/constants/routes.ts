import { createHashHistory, RouteConfig } from '@liuli-util/react-router'
import { LayoutView } from '../views/layout/LayoutView'

export const h = createHashHistory()

export interface MenuConfig extends RouteConfig {
  meta: {
    title: string
    icon: string
  }
}

export const menus: MenuConfig[] = [
  {
    path: '/',
    component: () => import('../views/home'),
    meta: {
      title: '首页',
      icon: '',
    },
  },
  {
    path: '/store',
    component: () => import('../views/store'),
    meta: {
      title: '插件商店',
      icon: '',
    },
  },
]

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: LayoutView,
    children: menus,
  },
]
