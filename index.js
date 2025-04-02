const {ipcRenderer} = require('electron')

document.querySelector('#open').addEventListener('click', async() => {
    const {canceled,data}= await ipcRenderer .invoke('open')
    if (canceled) return 
    document.querySelector('#text').value= data[0]||''
  })