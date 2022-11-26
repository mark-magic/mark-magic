import { build } from 'esbuild'

const n = Date.now()
await build({
  entryPoints: ['src/bin.mts'],
  platform: 'node',
  format: 'esm',
  outfile: 'cli/bin.mjs',
  bundle: true,
  banner: {
    js: `
import { createRequire as createRequire_${n} } from 'module';
import path_${n} from 'path';
import { fileURLToPath as fileURLToPath_${n} } from 'url';
const require = createRequire_${n}(import.meta.url);
const __filename = fileURLToPath_${n}(import.meta.url);
const __dirname = path_${n}.dirname(__filename);
`,
  },
})
