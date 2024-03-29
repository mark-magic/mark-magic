import { hydrate, prerender as ssr } from 'preact-iso'
import { Signal, useSignal } from '@preact/signals'

import './style.css'
import clsx from 'clsx'

interface AsyncState<T extends (...args: any[]) => Promise<T>> {
  state: {
    value: Signal<Awaited<ReturnType<T>>>
    loading: Signal<boolean>
    error: Signal<Error | null>
  }
  execute: T
}

function useAsyncFn<T extends (...args: any[]) => Promise<any>>(fn: T): AsyncState<T> {
  const value = useSignal(null)
  const loading = useSignal(false)
  const error = useSignal(null)
  return {
    state: { value, loading, error },
    execute: (async (...args) => {
      try {
        loading.value = true
        value.value = await fn(...args)
        error.value = null
        return value.value
      } catch (e) {
        error.value = e
        value.value = null
      } finally {
        loading.value = false
      }
    }) as T,
  }
}

function Loading() {
  return (
    <svg
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        data-darkreader-inline-stroke=""
        style="--darkreader-inline-stroke: currentColor;"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        data-darkreader-inline-fill=""
        style="--darkreader-inline-fill: currentColor;"
      ></path>
    </svg>
  )
}

const supports = [
  {
    name: 'Archive of Our Own',
    url: 'https://archiveofourown.org',
  },
  {
    name: 'Sufficient Velocity',
    url: 'https://forums.sufficientvelocity.com',
  },
  {
    name: 'Sufficient Battles',
    url: 'https://forums.spacebattles.com',
  },
  {
    name: 'Bilibili readlist',
    url: 'https://www.bilibili.com/read/home',
  },
]

// 下载一个 url 的 epub 文件，模拟 a 链接点击
function download(url) {
  var a = document.createElement('a')
  a.href = url
  a.download = ''
  a.click()
}

export function App() {
  const url = useSignal('')
  const { state, execute: onGen } = useAsyncFn(async () => {
    if (url.value.trim() === '') {
      return
    }
    const resp = await (
      await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ url: url.value }),
        headers: { 'Content-Type': 'application/json' },
      })
    ).json()
    if (resp.error) {
      throw new Error(resp.error.message)
    }
    const r = location.origin + resp.url
    download(r)
    return {
      epub: r,
      markdown: r + '?format=markdown',
    }
  })
  return (
    <div className="container md:max-w-xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 mt-8 text-center">EpubHub</h1>
      <form
        onSubmit={async (ev) => {
          ev.preventDefault()
          if (state.loading.value) {
            return
          }
          await onGen()
        }}
      >
        <div className="mb-4">
          <input
            id="url"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter a URL and click Generate to generate an Epub."
            value={url}
            onInput={(ev) => (url.value = (ev.target as HTMLInputElement).value)}
            required={true}
            onKeyPress={async (ev) => {
              if (ev.key === 'Enter') {
                await onGen()
              }
            }}
          />
        </div>
        <div className="mb-4">
          <button
            className={clsx('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center ', {
              'opacity-50 cursor-not-allowed': state.loading.value,
            })}
            type={'submit'}
          >
            {state.loading.value && <Loading />}
            Generate
          </button>
        </div>
      </form>
      <div>
        {state.error.value && <div className="text-red-500">Error: {state.error.value.message}</div>}
        {state.value.value && (
          <div>
            Generated at{' '}
            <ul>
              {Object.entries(state.value.value).map(([k, v]) => (
                <li key={k}>
                  {k}:{' '}
                  <a href={v} className="text-blue-500" download={true}>
                    {v}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <hr className="my-8" />
      <div>
        <h2 className="text-xl font-bold mb-4">Supports</h2>
        <ul className="list-disc list-inside">
          {supports.map((it) => (
            <li key={it.name}>
              <a href={it.url} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                {it.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <footer className="mt-8 text-center">
        <a href="https://github.com/mark-magic/mark-magic" className="text-blue-500" target={'_blank'}>
          mark-magic @ 2024
        </a>
      </footer>
    </div>
  )
}

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app'))
}

export async function prerender(data) {
  return await ssr(<App {...data} />)
}
