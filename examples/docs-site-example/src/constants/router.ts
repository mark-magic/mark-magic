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
    children: [
      {
        path: '/01/001-第一章-许愿',
        component: () => import('../views/content/assets/books/01/001-第一章-许愿.md'),
        meta: {
          title: '第一章-许愿',
        },
      },
      {
        path: '/01/002-第二章-幻影',
        component: () => import('../views/content/assets/books/01/002-第二章-幻影.md'),
        meta: {
          title: '第二章-幻影',
        },
      },
      {
        path: '/01/003-第三章-麻美观影记-上',
        component: () => import('../views/content/assets/books/01/003-第三章-麻美观影记-上.md'),
        meta: {
          title: '第三章-麻美观影记-上',
        },
      },
      {
        path: '/01/004-第四章-麻美观影记-下',
        component: () => import('../views/content/assets/books/01/004-第四章-麻美观影记-下.md'),
        meta: {
          title: '第四章-麻美观影记-下',
        },
      },
      {
        path: '/01/005-第五章-家人',
        component: () => import('../views/content/assets/books/01/005-第五章-家人.md'),
        meta: {
          title: '第五章-家人',
        },
      },
      {
        path: '/01/006-第六章-军队',
        component: () => import('../views/content/assets/books/01/006-第六章-军队.md'),
        meta: {
          title: '第六章-军队',
        },
      },
      {
        path: '/01/007-第七章-南方组',
        component: () => import('../views/content/assets/books/01/007-第七章-南方组.md'),
        meta: {
          title: '第七章-南方组',
        },
      },
      {
        path: '/01/008-第八章-政与教',
        component: () => import('../views/content/assets/books/01/008-第八章-政与教.md'),
        meta: {
          title: '第八章-政与教',
        },
      },
      {
        path: '/01/009-第九章-回声',
        component: () => import('../views/content/assets/books/01/009-第九章-回声.md'),
        meta: {
          title: '第九章-回声',
        },
      },
      {
        path: '/01/010-第十章-准将',
        component: () => import('../views/content/assets/books/01/010-第十章-准将.md'),
        meta: {
          title: '第十章-准将',
        },
      },
      {
        path: '/01/011-第十一章-以往生活的残骸',
        component: () => import('../views/content/assets/books/01/011-第十一章-以往生活的残骸.md'),
        meta: {
          title: '第十一章-以往生活的残骸',
        },
      },
      {
        path: '/01/012-第十二章-狩猎魔兽的人',
        component: () => import('../views/content/assets/books/01/012-第十二章-狩猎魔兽的人.md'),
        meta: {
          title: '第十二章-狩猎魔兽的人',
        },
      },
      {
        path: '/01/013-第十三章-不对等的信息',
        component: () => import('../views/content/assets/books/01/013-第十三章-不对等的信息.md'),
        meta: {
          title: '第十三章-不对等的信息',
        },
      },
      {
        path: '/01/014-第十四章-血缘',
        component: () => import('../views/content/assets/books/01/014-第十四章-血缘.md'),
        meta: {
          title: '第十四章-血缘',
        },
      },
      {
        path: '/01/015-第十五章-萨姆萨拉',
        component: () => import('../views/content/assets/books/01/015-第十五章-萨姆萨拉.md'),
        meta: {
          title: '第十五章-萨姆萨拉',
        },
      },
      {
        path: '/01/016-第十六章-属于天空的光芒',
        component: () => import('../views/content/assets/books/01/016-第十六章-属于天空的光芒.md'),
        meta: {
          title: '第十六章-属于天空的光芒',
        },
      },
    ],
    component: () => import('../views/content/assets/books/01/readme.md'),
    meta: {
      title: '第一卷-量子纠缠',
    },
  },
  {
    path: '/02',
    children: [
      {
        path: '/02/017-幕间-1-无间迷梦',
        component: () => import('../views/content/assets/books/02/017-幕间-1-无间迷梦.md'),
        meta: {
          title: '幕间-1-无间迷梦',
        },
      },
      {
        path: '/02/018-第十八章-落地',
        component: () => import('../views/content/assets/books/02/018-第十八章-落地.md'),
        meta: {
          title: '第十八章-落地',
        },
      },
      {
        path: '/02/019-第十九章-回天',
        component: () => import('../views/content/assets/books/02/019-第十九章-回天.md'),
        meta: {
          title: '第十九章-回天',
        },
      },
      {
        path: '/02/020-第二十章-相对论',
        component: () => import('../views/content/assets/books/02/020-第二十章-相对论.md'),
        meta: {
          title: '第二十章-相对论',
        },
      },
      {
        path: '/02/021-第二十一章-突变',
        component: () => import('../views/content/assets/books/02/021-第二十一章-突变.md'),
        meta: {
          title: '第二十一章-突变',
        },
      },
      {
        path: '/02/022-第二十二章-变化的风向',
        component: () => import('../views/content/assets/books/02/022-第二十二章-变化的风向.md'),
        meta: {
          title: '第二十二章-变化的风向',
        },
      },
      {
        path: '/02/023-第二十三章-失去的爱',
        component: () => import('../views/content/assets/books/02/023-第二十三章-失去的爱.md'),
        meta: {
          title: '第二十三章-失去的爱',
        },
      },
      {
        path: '/02/024-第二十四章-历史学家',
        component: () => import('../views/content/assets/books/02/024-第二十四章-历史学家.md'),
        meta: {
          title: '第二十四章-历史学家',
        },
      },
      {
        path: '/02/025-第二十五章-穿破天空',
        component: () => import('../views/content/assets/books/02/025-第二十五章-穿破天空.md'),
        meta: {
          title: '第二十五章-穿破天空',
        },
      },
      {
        path: '/02/026-第二十六章-红与绿的血',
        component: () => import('../views/content/assets/books/02/026-第二十六章-红与绿的血.md'),
        meta: {
          title: '第二十六章-红与绿的血',
        },
      },
      {
        path: '/02/027-第二十七章-那些璀璨的明星',
        component: () => import('../views/content/assets/books/02/027-第二十七章-那些璀璨的明星.md'),
        meta: {
          title: '第二十七章-那些璀璨的明星',
        },
      },
      {
        path: '/02/028-第二十八章-不屈吾魂',
        component: () => import('../views/content/assets/books/02/028-第二十八章-不屈吾魂.md'),
        meta: {
          title: '第二十八章-不屈吾魂',
        },
      },
      {
        path: '/02/029-第二十九章-救世之女',
        component: () => import('../views/content/assets/books/02/029-第二十九章-救世之女.md'),
        meta: {
          title: '第二十九章-救世之女',
        },
      },
      {
        path: '/02/030-第三十章-权力与使命',
        component: () => import('../views/content/assets/books/02/030-第三十章-权力与使命.md'),
        meta: {
          title: '第三十章-权力与使命',
        },
      },
      {
        path: '/02/031-第三十一章-爱的形式',
        component: () => import('../views/content/assets/books/02/031-第三十一章-爱的形式.md'),
        meta: {
          title: '第三十一章-爱的形式',
        },
      },
      {
        path: '/02/032-第三十二章-选择与未来',
        component: () => import('../views/content/assets/books/02/032-第三十二章-选择与未来.md'),
        meta: {
          title: '第三十二章-选择与未来',
        },
      },
    ],
    component: () => import('../views/content/assets/books/02/readme.md'),
    meta: {
      title: '第二卷-宇宙膨胀',
    },
  },
  {
    path: '/03',
    children: [
      {
        path: '/03/033-幕间-2-小玛德莱娜',
        component: () => import('../views/content/assets/books/03/033-幕间-2-小玛德莱娜.md'),
        meta: {
          title: '幕间-2-小玛德莱娜',
        },
      },
      {
        path: '/03/034-第三十四章-造就我们的那些羁绊',
        component: () => import('../views/content/assets/books/03/034-第三十四章-造就我们的那些羁绊.md'),
        meta: {
          title: '第三十四章-造就我们的那些羁绊',
        },
      },
      {
        path: '/03/035-第三十五章-伤亡',
        component: () => import('../views/content/assets/books/03/035-第三十五章-伤亡.md'),
        meta: {
          title: '第三十五章-伤亡',
        },
      },
      {
        path: '/03/036-第三十六章-追逐幻影',
        component: () => import('../views/content/assets/books/03/036-第三十六章-追逐幻影.md'),
        meta: {
          title: '第三十六章-追逐幻影',
        },
      },
      {
        path: '/03/037-第三十七章-炽天使',
        component: () => import('../views/content/assets/books/03/037-第三十七章-炽天使.md'),
        meta: {
          title: '第三十七章-炽天使',
        },
      },
      {
        path: '/03/038-第三十八章-把握今天',
        component: () => import('../views/content/assets/books/03/038-第三十八章-把握今天.md'),
        meta: {
          title: '第三十八章-把握今天',
        },
      },
      {
        path: '/03/039-第三十九章-无法愈合的伤痕',
        component: () => import('../views/content/assets/books/03/039-第三十九章-无法愈合的伤痕.md'),
        meta: {
          title: '第三十九章-无法愈合的伤痕',
        },
      },
      {
        path: '/03/040-第四十章-镜之彼端',
        component: () => import('../views/content/assets/books/03/040-第四十章-镜之彼端.md'),
        meta: {
          title: '第四十章-镜之彼端',
        },
      },
      {
        path: '/03/041-第四十一章-因与果',
        component: () => import('../views/content/assets/books/03/041-第四十一章-因与果.md'),
        meta: {
          title: '第四十一章-因与果',
        },
      },
      {
        path: '/03/042-第四十二章-有光必有影',
        component: () => import('../views/content/assets/books/03/042-第四十二章-有光必有影.md'),
        meta: {
          title: '第四十二章-有光必有影',
        },
      },
      {
        path: '/03/043-幕间-2.5-尘封的往事-上',
        component: () => import('../views/content/assets/books/03/043-幕间-2.5-尘封的往事-上.md'),
        meta: {
          title: '幕间-2.5-尘封的往事-上',
        },
      },
      {
        path: '/03/044-幕间-2.5-尘封的往事-下',
        component: () => import('../views/content/assets/books/03/044-幕间-2.5-尘封的往事-下.md'),
        meta: {
          title: '幕间-2.5-尘封的往事-下',
        },
      },
      {
        path: '/03/045-第四十五章-带电的肉体',
        component: () => import('../views/content/assets/books/03/045-第四十五章-带电的肉体.md'),
        meta: {
          title: '第四十五章-带电的肉体',
        },
      },
      {
        path: '/03/046-第四十六章-轮中之轮',
        component: () => import('../views/content/assets/books/03/046-第四十六章-轮中之轮.md'),
        meta: {
          title: '第四十六章-轮中之轮',
        },
      },
      {
        path: '/03/047-第四十七章-光明之城',
        component: () => import('../views/content/assets/books/03/047-第四十七章-光明之城.md'),
        meta: {
          title: '第四十七章-光明之城',
        },
      },
      {
        path: '/03/048-第四十八章-知己知彼',
        component: () => import('../views/content/assets/books/03/048-第四十八章-知己知彼.md'),
        meta: {
          title: '第四十八章-知己知彼',
        },
      },
      {
        path: '/03/049-第四十九章-过渡态',
        component: () => import('../views/content/assets/books/03/049-第四十九章-过渡态.md'),
        meta: {
          title: '第四十九章-过渡态',
        },
      },
      {
        path: '/03/050-第五十章-玫瑰之下',
        component: () => import('../views/content/assets/books/03/050-第五十章-玫瑰之下.md'),
        meta: {
          title: '第五十章-玫瑰之下',
        },
      },
      {
        path: '/03/051-第五十一章-永恒的求索',
        component: () => import('../views/content/assets/books/03/051-第五十一章-永恒的求索.md'),
        meta: {
          title: '第五十一章-永恒的求索',
        },
      },
      {
        path: '/03/052-第五十二章-我们是谁',
        component: () => import('../views/content/assets/books/03/052-第五十二章-我们是谁.md'),
        meta: {
          title: '第五十二章-我们是谁',
        },
      },
      {
        path: '/03/053-第五十三章-立场',
        component: () => import('../views/content/assets/books/03/053-第五十三章-立场.md'),
        meta: {
          title: '第五十三章-立场',
        },
      },
      {
        path: '/03/054-第五十四章-永恒的青春',
        component: () => import('../views/content/assets/books/03/054-第五十四章-永恒的青春.md'),
        meta: {
          title: '第五十四章-永恒的青春',
        },
      },
      {
        path: '/03/055-第五十五章-新视点',
        component: () => import('../views/content/assets/books/03/055-第五十五章-新视点.md'),
        meta: {
          title: '第五十五章-新视点',
        },
      },
      {
        path: '/03/056-第五十六章-脉冲星',
        component: () => import('../views/content/assets/books/03/056-第五十六章-脉冲星.md'),
        meta: {
          title: '第五十六章-脉冲星',
        },
      },
      {
        path: '/03/057-第五十七章-三相点',
        component: () => import('../views/content/assets/books/03/057-第五十七章-三相点.md'),
        meta: {
          title: '第五十七章-三相点',
        },
      },
      {
        path: '/03/058-第五十八章-托付信任',
        component: () => import('../views/content/assets/books/03/058-第五十八章-托付信任.md'),
        meta: {
          title: '第五十八章-托付信任',
        },
      },
      {
        path: '/03/059-第五十九章-室内游戏',
        component: () => import('../views/content/assets/books/03/059-第五十九章-室内游戏.md'),
        meta: {
          title: '第五十九章-室内游戏',
        },
      },
      {
        path: '/03/060-第六十章-数码预言',
        component: () => import('../views/content/assets/books/03/060-第六十章-数码预言.md'),
        meta: {
          title: '第六十章-数码预言',
        },
      },
      {
        path: '/03/061-第六十一章-遁入虚空',
        component: () => import('../views/content/assets/books/03/061-第六十一章-遁入虚空.md'),
        meta: {
          title: '第六十一章-遁入虚空',
        },
      },
      {
        path: '/03/062-第六十二章-消逝的光芒-上',
        component: () => import('../views/content/assets/books/03/062-第六十二章-消逝的光芒-上.md'),
        meta: {
          title: '第六十二章-消逝的光芒-上',
        },
      },
      {
        path: '/03/063-第六十三章-消逝的光芒-下',
        component: () => import('../views/content/assets/books/03/063-第六十三章-消逝的光芒-下.md'),
        meta: {
          title: '第六十三章-消逝的光芒-下',
        },
      },
    ],
    component: () => import('../views/content/assets/books/03/readme.md'),
    meta: {
      title: '第三卷-存在悖论',
    },
  },
  {
    path: '/04',
    children: [
      {
        path: '/04/064-幕间-3-昭昭天命',
        component: () => import('../views/content/assets/books/04/064-幕间-3-昭昭天命.md'),
        meta: {
          title: '幕间-3-昭昭天命',
        },
      },
      {
        path: '/04/065-第六十五章-另辟蹊径',
        component: () => import('../views/content/assets/books/04/065-第六十五章-另辟蹊径.md'),
        meta: {
          title: '第六十五章-另辟蹊径',
        },
      },
      {
        path: '/04/066-第六十六章-余波',
        component: () => import('../views/content/assets/books/04/066-第六十六章-余波.md'),
        meta: {
          title: '第六十六章-余波',
        },
      },
      {
        path: '/04/067-第六十七章-天各一方',
        component: () => import('../views/content/assets/books/04/067-第六十七章-天各一方.md'),
        meta: {
          title: '第六十七章-天各一方',
        },
      },
    ],
    component: () => import('../views/content/assets/books/04/readme.md'),
    meta: {
      title: '第四卷-爱因斯坦-罗森桥',
    },
  },
  {
    path: '/99',
    children: [
      {
        path: '/99/001-背景时间线',
        component: () => import('../views/content/assets/books/99/001-背景时间线.md'),
        meta: {
          title: '背景时间线',
        },
      },
      {
        path: '/99/002-角色设定-1',
        component: () => import('../views/content/assets/books/99/002-角色设定-1.md'),
        meta: {
          title: '角色设定-1',
        },
      },
      {
        path: '/99/003-角色设定-2',
        component: () => import('../views/content/assets/books/99/003-角色设定-2.md'),
        meta: {
          title: '角色设定-2',
        },
      },
      {
        path: '/99/004-角色设定-3',
        component: () => import('../views/content/assets/books/99/004-角色设定-3.md'),
        meta: {
          title: '角色设定-3',
        },
      },
      {
        path: '/99/005-人物关系表',
        component: () => import('../views/content/assets/books/99/005-人物关系表.md'),
        meta: {
          title: '人物关系表',
        },
      },
      {
        path: '/99/006-原作者参与的一些讨论',
        component: () => import('../views/content/assets/books/99/006-原作者参与的一些讨论.md'),
        meta: {
          title: '原作者参与的一些讨论',
        },
      },
      {
        path: '/99/007-组织介绍-执政体',
        component: () => import('../views/content/assets/books/99/007-组织介绍-执政体.md'),
        meta: {
          title: '组织介绍-执政体',
        },
      },
      {
        path: '/99/008-读者问答',
        component: () => import('../views/content/assets/books/99/008-读者问答.md'),
        meta: {
          title: '读者问答',
        },
      },
      {
        path: '/99/009-读者问答-2',
        component: () => import('../views/content/assets/books/99/009-读者问答-2.md'),
        meta: {
          title: '读者问答-2',
        },
      },
      {
        path: '/99/010-读者问答-3',
        component: () => import('../views/content/assets/books/99/010-读者问答-3.md'),
        meta: {
          title: '读者问答-3',
        },
      },
      {
        path: '/99/011-组织介绍-魔法少女行会',
        component: () => import('../views/content/assets/books/99/011-组织介绍-魔法少女行会.md'),
        meta: {
          title: '组织介绍-魔法少女行会',
        },
      },
      {
        path: '/99/012-译名对照表',
        component: () => import('../views/content/assets/books/99/012-译名对照表.md'),
        meta: {
          title: '译名对照表',
        },
      },
    ],
    component: () => import('../views/content/assets/books/99/readme.md'),
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
