import React from 'react'
import css from './LayoutView.module.css'
import { ButtonShadcn, cn } from '@liuli-util/ui'
import { Link, RouterView, useRouter } from '@liuli-util/react-router'
import { treeMap } from '@liuli-util/tree'
import { contents } from '../../constants/router'

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center h-full shadow-lg">
      <h1 className="pl-4 font-bold">
        <Link to={'/'}>魔法少女小圆 飞向星空</Link>
      </h1>
    </header>
  )
}

function SidebarItem(props: { href: string; title: string; active: boolean; deps: number }) {
  return (
    <Link
      to={props.href}
      className={cn(
        ButtonShadcn.buttonVariants({ variant: 'ghost' }),
        props.active ? 'bg-muted bg-accent text-accent-foreground' : '',
        'justify-start w-full hover:bg-muted',
        {
          0: 'pl-0',
          1: 'pl-2',
          2: 'pl-4',
          3: 'pl-6',
          4: 'pl-8',
          5: 'pl-10',
          6: 'pl-12',
        }[props.deps ?? 0],
      )}
    >
      {props.title}
    </Link>
  )
}

const Sidebar: React.FC = () => {
  const router = useRouter()
  return (
    <nav className={'flex flex-col'}>
      <ul>
        {treeMap(
          contents,
          (it, path) => {
            const isActive = decodeURI(router.location.pathname) === it.routePath
            if (it.children) {
              return (
                <li key={it.routePath}>
                  <SidebarItem
                    key={it.routePath}
                    href={it.routePath}
                    active={isActive}
                    deps={path.length}
                    title={it.path!}
                  />
                  <ul className={'flex flex-col'}>{it.children}</ul>
                </li>
              )
            }
            return (
              <li key={it.routePath}>
                <SidebarItem href={it.routePath} active={isActive} deps={path.length} title={it.path!} />
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
  return <RouterView />
}

export const LayoutView: React.FC = () => {
  return (
    <div>
      <div className={css.navbar}>
        <Navbar />
      </div>
      <aside className={css.sidebar}>
        <Sidebar />
      </aside>
      <main className={css.content}>
        <Content />
      </main>
    </div>
  )
}
