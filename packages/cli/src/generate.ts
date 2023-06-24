import $RefParser from '@apidevtools/json-schema-ref-parser'
import pathe from 'pathe'
import { writeFile } from 'fs/promises'

const r = await $RefParser.bundle(pathe.resolve(__dirname, './config.schema.json'))
await writeFile(pathe.resolve(__dirname, '../dist/config.schema.json'), JSON.stringify(r, null, 2))
