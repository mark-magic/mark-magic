/// <reference types="vite/client" />

declare module '*.md' {
  import { FC } from 'react'
  const component: FC
  export default component
}
