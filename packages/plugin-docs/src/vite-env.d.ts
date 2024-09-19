/// <reference types="vite/client" />

declare module '*?script' {
  const component: string
  export default component
}

declare module '@hackmd/markdown-it-task-lists' {
  const taskLists: any
  export default taskLists
}
