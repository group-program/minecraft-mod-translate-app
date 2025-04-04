// main.js

// このモジュールはアプリケーションの生き死にを制御し、ネイティブブラウザウインドウを作成します
const fs = require("fs")
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')

const createWindow = () => {
  // ブラウザウインドウを作成します。
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // そしてアプリの index.html を読み込みます。
  mainWindow.loadFile('index.html')

  // デベロッパー ツールを開きます。
  // mainWindow.webContents.openDevTools()
}

// このメソッドは、Electron の初期化が完了し、
// ブラウザウインドウの作成準備ができたときに呼ばれます。
// 一部のAPIはこのイベントが発生した後にのみ利用できます。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // macOS では、Dock アイコンのクリック時に他に開いているウインドウがない
    // 場合、アプリのウインドウを再作成するのが一般的です。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// macOS を除き、全ウインドウが閉じられたときに終了します。 ユーザーが
// Cmd + Q で明示的に終了するまで、アプリケーションとそのメニューバーを
// アクティブにするのが一般的です。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// このファイルでは、アプリ内のとある他のメインプロセスコードを
// インクルードできます。 
// 別々のファイルに分割してここで require することもできます。

ipcMain.handle('open', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [
      { name: 'Documents', extension: ['txt'] }
    ]
  })
  if (canceled) return { canceled, data: [] }

  const data = filePaths.map((filePath) =>
    fs.readFileSync(filePath, { encoding: 'utf-8' })
  )
  return { canceled, data }
})
ipcMain.handle('save', async (event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [
      { name: 'Documents', extension: ['txt'] }
    ]
  })
  if (canceled) return
  fs.writeFileSync(filePath, data)
})