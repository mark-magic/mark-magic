import { beforeAll } from 'vitest'
import { config } from 'dotenv'
import path from 'pathe'
import { pathExists } from 'fs-extra/esm'

beforeAll(async () => {
  const envPath = path.resolve(__dirname, '../.env.local')
  if (await pathExists(envPath)) {
    config({ path: envPath })
  }
})
