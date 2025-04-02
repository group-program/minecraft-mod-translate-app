const {ipcRenderer} = require('electron')

document.querySelector('#open').addEventListener('click', async() => {
    const {canceled,data}= await ipcRenderer .invoke('open')
    if (canceled) return 
    document.querySelector('#text').value= data[0]||''
  })

  documet.querySelector('#save').addEventListener('click',async()=>{
    const data = document.querySelector('#text').value
    await ipcRenderer.invoke('save',data) 
  })