import { useRouter } from '@liuli-util/react-router'
import React from 'react'
import md01_001 from './assets/books/01/001-第一章-许愿.md'

export const ContentView: React.FC = () => {
  const router = useRouter()
  return (
    <div
      className={'prose mx-auto dark:prose-dark'}
      dangerouslySetInnerHTML={{
        __html: md01_001,
      }}
    ></div>
  )
}
