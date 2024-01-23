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

export function App() {
  const url = useSignal('')
  const { state, execute: onGen } = useAsyncFn(async () => {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ url: url.value }),
      headers: { 'Content-Type': 'application/json' },
    })
    const r = await resp.json()
    if (r.error) {
      throw new Error(r.error.message)
    }
    return location.origin + r.url
  })
  return (
    <div className="container md mx-auto px-4">
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
            placeholder="Enter a URL and click Export to generate an EPUB."
            value={url}
            onInput={(ev) => (url.value = (ev.target as HTMLInputElement).value)}
            required={true}
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
            Epub generated at{' '}
            <a href={state.value.value} className="text-blue-500" download={true}>
              {state.value.value}
            </a>
          </div>
        )}
      </div>
      <hr className="my-8" />
      <div>
        Supports:
        <ul className="list-disc list-inside">
          {[
            {
              name: 'Archive of Our Own',
              url: 'https://archiveofourown.org',
            },
            {
              name: 'Sufficient Velocity',
              url: 'https://forums.sufficientvelocity.com/',
            },
          ].map((it) => (
            <li>
              <a href={it.url} class={'text-blue-500'} target={'_blank'}>
                {it.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <footer className="mt-8 text-center">
        <a href="https://github.com/mark-magic/mark-magic" className="text-blue-500" target={'_blank'}>
          @mark-magic
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
