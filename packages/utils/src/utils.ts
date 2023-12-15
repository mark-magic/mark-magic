import path from 'pathe'

export const isIndex = (p: string) => ['readme.md', 'index.md'].includes(path.basename(p).toLocaleLowerCase())
