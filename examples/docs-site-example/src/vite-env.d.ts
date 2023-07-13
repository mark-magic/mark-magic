/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}
