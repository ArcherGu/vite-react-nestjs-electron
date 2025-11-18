import { useEffect, useRef, useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

const { sendMsg: sendMsgToMainProcess, onReplyMsg } = window.electron

function App() {
  const [log, setLog] = useState('')
  const [msg, setMsg] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMsg(e.target.value)
  }

  async function sendMsg() {
    try {
      setIsSending(true)
      setLog(log => `${log}[render]: ${msg} \n`)
      const data = await sendMsgToMainProcess(msg)
      setLog(log => `${log}[main]: ${data} \n`)
      setMsg('')
      setTimeout(() => {
        textareaRef.current?.scrollTo({
          top: textareaRef.current?.scrollHeight,
          behavior: 'smooth',
        })
      }, 100)
    }
    catch (error) {
      console.error(error)
      setLog(log => `${log}[error]: ${error} \n`)
    }
    finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    const offOnReplyMsg = onReplyMsg((msg: string) => {
      setLog(log => `${log}[main]: ${msg} \n`)
    })
    return () => {
      offOnReplyMsg()
    }
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img alt="logo" src={logo} className="logo" />
        </div>
        <p className="app-subtitle">Modern desktop application built with Vite + NestJS + Electron</p>
      </header>

      <main className="app-main">
        <div className="hello-world">
          <div className="card">
            <div className="card-body">
              <div className="log-section">
                <label className="label">Message Log</label>
                <textarea
                  ref={textareaRef}
                  value={log}
                  className="log-output"
                  placeholder="Message logs will appear here..."
                  readOnly
                />
                <div className="log-actions">
                  <p className="card-description">Communicate with the main process</p>
                  <button className="btn btn-secondary btn-sm" disabled={!log} onClick={() => setLog('')}>
                    Clear Log
                  </button>
                </div>
              </div>

              <div className="input-section">
                <label className="label">Send Message</label>
                <div className="input-group">
                  <input
                    className="input"
                    value={msg}
                    disabled={isSending}
                    type="text"
                    placeholder="Enter message to send to main process..."
                    onChange={handleInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        sendMsg()
                      }
                    }}
                  />

                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={isSending || !msg.trim()}
                    onClick={sendMsg}
                  >
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Fast Development · Efficient Build · Modern Experience</p>
      </footer>
    </div>
  )
}

export default App
