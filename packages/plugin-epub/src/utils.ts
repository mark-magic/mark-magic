export function formatRelative(s: string): string {
  const prefix = ['./', '../']
  const r = s.replaceAll('\\', '/')
  return encodeURI(prefix.some((i) => r.startsWith(i)) ? r : './' + r)
}

export const isResourceLink = (link: string) => link.startsWith(':/resource/')
export const isContentLink = (link: string) => link.startsWith(':/content/')
export const extractResourceId = (link: string) => link.slice(':/resource/'.length)
export const extractContentId = (link: string) => link.slice(':/content/'.length)
export const wrapContentLink = (id: string) => ':/content/' + id
export const wrapResourceLink = (id: string) => ':/resource/' + id
