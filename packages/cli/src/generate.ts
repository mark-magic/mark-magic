import $RefParser from '@apidevtools/json-schema-ref-parser'
import pathe from 'pathe'
import { writeFile } from 'fs/promises'

const schemaPath = pathe.resolve(__dirname, './config.schema.json')
console.log('Bundling schema:', schemaPath)
const r = await $RefParser.bundle(schemaPath)
await writeFile(pathe.resolve(__dirname, '../dist/config.schema.json'), JSON.stringify(r, null, 2))
