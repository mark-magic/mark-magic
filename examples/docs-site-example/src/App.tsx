import { range } from 'lodash-es'
import { Random, mock } from 'mockjs'
import React from 'react'
import { clsx } from 'clsx'
import css from './App.module.css'

const Navbar: React.FC = () => {
  return (
    <header>
      <h1>Header</h1>
    </header>
  )
}

const Sidebar: React.FC = () => {
  const list = range(1, 100).map(() => ({
    id: Random.id(),
    title: Random.ctitle(),
  }))
  return (
    <div>
      <ul>
        {list.map((it) => (
          <li key={it.id}>{it.title}</li>
        ))}
      </ul>
    </div>
  )
}

const Content: React.FC = () => {
  return (
    <div>
      <h1>Content</h1>
      <p className={'h-screen'}></p>
    </div>
  )
}

export const App: React.FC = () => {
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
