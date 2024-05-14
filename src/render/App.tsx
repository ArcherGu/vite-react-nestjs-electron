import { useEffect, useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

const { sendMsg: sendMsgToMainProcess, onReplyMsg } = window.electron

function App() {
  const [log, setLog] = useState('')
  const [msg, setMsg] = useState('')

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMsg(e.target.value)
  }

  async function sendMsg() {
    try {
      setLog(log => `${log}[render]: ${msg} \n`)
      const data = await sendMsgToMainProcess(msg)
      setLog(log => `${log}[main]: ${data} \n`)
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    onReplyMsg((msg: string) => {
      setLog(log => `${log}[main]: ${msg} \n`)
    })
  }, [])

  return (
    <>
      <img alt="logo" src={logo} className="logo" />
      <h1>
        Vite + React + Electron & Esbuild
      </h1>

      <textarea value={log} cols={60} rows={10} disabled />
      <div style={{ marginTop: 20 }}>
        <input value={msg} type="text" placeholder="send msg to main process" onChange={handleInput} />
        <button type="button" style={{ marginLeft: 20 }} onClick={sendMsg}>
          Send
        </button>
      </div>
    </>
  )
}

export default App
