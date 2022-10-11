import { getYamlMeta, Root } from '@liuli-util/markdown-util'
import { Tag } from '@mami/cli'
import { v4 } from 'uuid'

export function getTags(root: Root): Tag[] {
  const meta = getYamlMeta<Record<string, any> | undefined>(root)
  return ((meta?.tags ?? []) as string[]).map((title) => ({ id: v4(), title } as Tag))
}
