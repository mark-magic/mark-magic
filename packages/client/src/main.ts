import { app, BrowserWindow } from 'electron'
import { start } from '@mami/server'
import getPort from 'get-port'

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  const port = await getPort()
  console.log()
  start({
    static: __dirname,
    port: port,
  })
  win.loadURL(`http://localhost:${port}`)
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
