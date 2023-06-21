import pathe from 'pathe'

export const isIndex = (path: string) => ['readme.md', 'index.md'].includes(pathe.basename(path).toLocaleLowerCase())
