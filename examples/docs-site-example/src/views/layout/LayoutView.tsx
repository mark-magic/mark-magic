import { range } from 'lodash-es'
import { Random } from 'mockjs'
import React from 'react'
import css from './LayoutView.module.css'
import { ButtonShadcn, cn } from '@liuli-util/ui'
import { Link, RouterView } from '@liuli-util/react-router'

const Navbar: React.FC = () => {
  return (
    <header>
      <h1>Header</h1>
    </header>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
  activeKey?: string
}

function SidebarNav({ className, items, activeKey, ...props }: SidebarNavProps) {
  return (
    <nav className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            ButtonShadcn.buttonVariants({ variant: 'ghost' }),
            activeKey === item.href ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
            'justify-start',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

const Sidebar: React.FC = () => {
  const list = range(1, 100).map(() => ({
    id: Random.id(),
    title: Random.ctitle(),
  }))
  return (
    <div>
      <ul className={'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'}>
        <SidebarNav
          items={list.map((it) => ({
            href: `${it.id}`,
            title: it.title,
          }))}
        />
      </ul>
    </div>
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
