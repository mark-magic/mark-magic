import React, { Suspense, createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import css from './LayoutView.module.css'
import { Link, RouterView, useRouter } from '@liuli-util/react-router'
import { treeMap } from '@liuli-util/tree'
import { contentRoutes } from '../../constants/router'
import { cn } from '../../utils/cn'
import { useMedia } from 'react-use'

const Navbar: React.FC = () => {
  const { toggleSidebar } = useContext(AppContext)
  return (
    <header className="flex items-center h-full px-2">
      <button className={'md:hidden'} onClick={toggleSidebar}>
        切换
      </button>
      <h1 className="pl-4 font-bold">
        <Link to={'/'}>魔法少女小圆 飞向星空</Link>
      </h1>
    </header>
  )
}

function SidebarItem(props: { href: string; title: string; active: boolean }) {
  const { toggleSidebar } = useContext(AppContext)
  return (
    <Link
      to={props.href}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2',
        props.active ? 'bg-muted text-accent-foreground' : '',
        'justify-start w-full hover:bg-muted',
      )}
      onClick={toggleSidebar}
    >
      {props.title}
    </Link>
  )
}

function ScrollToTop() {
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [router.location.pathname])

  return null
}

const Sidebar: React.FC = () => {
  const router = useRouter()

  return (
    <nav className={'flex flex-col'}>
      <ScrollToTop />
      <ul>
        {treeMap(
          contentRoutes.filter((it) => it.path !== '/'),
          (it, path) => {
            const isActive = decodeURI(router.location.pathname) === it.path
            return (
              <li key={it.path}>
                <SidebarItem href={it.path} active={isActive} title={it.meta.title} />
                {it.children && (
                  <ul
                    className={cn(
                      'flex flex-col',
                      {
                        0: 'pl-0',
                        1: 'pl-2',
                        2: 'pl-4',
                        3: 'pl-6',
                        4: 'pl-8',
                        5: 'pl-10',
                        6: 'pl-12',
                      }[path.length ?? 0],
                    )}
                  >
                    {it.children}
                  </ul>
                )}
              </li>
            )
          },
          {
            id: 'path',
            children: 'children',
          },
        )}
      </ul>
    </nav>
  )
}

const Content: React.FC = () => {
  return (
    <Suspense fallback={'loading...'}>
      <article className={'prose mx-auto dark:prose-dark'}>
        <RouterView />
      </article>
    </Suspense>
  )
}

interface Config {
  sidebar: boolean
}
interface Context {
  sidebar: boolean
  toggleSidebar(): void
}

const AppContext = createContext<Context>(null as any)

export const LayoutView: React.FC = () => {
  const [config, setConfig] = useState<Config>({ sidebar: false })
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isWide = useMedia('(min-width: 768px)')
  function toggleSidebar() {
    const v = !config.sidebar
    document.body.style.overflowY = v ? 'hidden' : 'auto'
    sidebarRef.current!.className = cn(css.sidebar, v ? css.sidebarShow : css.sidebarHide)
    setConfig({ ...config, sidebar: v })
  }
  useEffect(() => {
    if (isWide && config.sidebar) {
      toggleSidebar()
      sidebarRef.current!.className = css.sidebar
    }
  }, [isWide, config.sidebar])
  const c = cn('bg-white text-black dark:bg-black dark:text-white')
  return (
    <AppContext.Provider
      value={{
        ...config,
        toggleSidebar: () => {
          const v = !config.sidebar
          document.body.style.overflowY = v ? 'hidden' : 'auto'
          sidebarRef.current!.className = cn(css.sidebar, c, v ? css.sidebarShow : css.sidebarHide)
          setConfig({ ...config, sidebar: v })
        },
      }}
    >
      <div>
        <aside ref={sidebarRef} className={cn(css.sidebar, c)}>
          <Sidebar />
        </aside>
        <div className={cn(css.navbar, c)}>
          <Navbar />
        </div>
        <main className={css.content}>
          <Content />
        </main>
      </div>
    </AppContext.Provider>
  )
}
