import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ViteDevServer, build, createServer } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { markdown } from '@liuli-util/vite-plugin-md'
import pathe from 'pathe'
import { initTempPath } from '@liuli-util/test'
import getPort from 'get-port'

const tempPath = initTempPath(__filename)

it('build', async () => {
  await build({
    root: pathe.resolve(__dirname, '../../'),
    plugins: [markdown({ mode: 'react' }), react()],
    css: {
      postcss: {
        plugins: [tailwindcss() as any, autoprefixer()],
      },
    },
    build: {
      outDir: pathe.resolve(tempPath, 'dist'),
    },
  })
}, 10_000)

describe('server', () => {
  let server: ViteDevServer
  beforeEach(async () => {
    server = await createServer({
      root: pathe.resolve(__dirname, '../../'),
      plugins: [markdown({ mode: 'react' }), react()],
      css: {
        postcss: {
          plugins: [tailwindcss() as any, autoprefixer()],
        },
      },
      build: {
        outDir: pathe.resolve(tempPath, 'dist'),
      },
      server: {
        port: await getPort(),
      },
    })
    await server.listen()
  })
  afterEach(async () => {
    await server.close()
  })

  it('server', async () => {
    const r = await (await fetch('http://localhost:' + server.config.server.port + '/')).text()
    expect(r).include('<!DOCTYPE html>')
  }, 10_000)
})
