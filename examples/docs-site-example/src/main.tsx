import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ReactRouter } from '@liuli-util/react-router'
import { routes } from './constants/router'
import { createHashHistory } from '@liuli-util/react-router/src'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactRouter history={createHashHistory()} routes={routes} fallback={<div>...</div>} />
  </React.StrictMode>,
)
