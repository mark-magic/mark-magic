import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.css'
import './index.css'
import { ReactRouter, RouterView } from '@liuli-util/react-router'
import { h, routes } from './constants/routes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactRouter history={h} routes={routes}></ReactRouter>
  </React.StrictMode>,
)
