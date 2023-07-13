import { RouteConfig } from '@liuli-util/react-router'
import { LayoutView } from '../views/layout/LayoutView'
import { ContentView } from '../views/content/ContentView'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: LayoutView,
    children: [
      {
        path: '/:id',
        component: ContentView,
      },
    ],
  },
]
