import { protocol, app, Tray } from 'electron'
import path from 'path'
import { creatAppTray } from './tray'

$tools.log.info(`Application <${$tools.APP_NAME}> launched.`)

let tray: Tray

app.allowRendererProcessReuse = true

const appLock = app.requestSingleInstanceLock()

if (!appLock) {
  // 作为第二个实例运行时, 主动结束进程
  app.quit()
}

app.on('second-instance', () => {
  // 当运行第二个实例时, 打开或激活首页
  $tools.createWindow('Home')
})

app.on('ready', () => {
  protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.substr(7)
    callback(decodeURI(path.normalize(url)))
  })
  tray = creatAppTray()
  $tools.createWindow('Home')
})

app.on('activate', () => {
  if (process.platform == 'darwin') {
    $tools.createWindow('Home')
  }
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('before-quit', () => {
  $tools.log.info(`Application <${$tools.APP_NAME}> has exited normally.`)

  if (process.platform === 'win32') {
    tray.destroy()
  }
})
