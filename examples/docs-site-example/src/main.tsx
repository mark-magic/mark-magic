import React from 'react'
import ReactDOM from 'react-dom/client'
import '@liuli-util/ui/style.css'
import './index.css'
import { ReactRouter, createBrowserHistory } from '@liuli-util/react-router'
import { routes } from './constants/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactRouter history={createBrowserHistory()} routes={routes} fallback={<div>...</div>} />
  </React.StrictMode>,
)
