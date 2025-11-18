import type { IpcRendererEvent } from 'electron'
import { ipcRenderer } from 'electron'

export default {
  sendMsg: (msg: string): Promise<string> => ipcRenderer.invoke('msg', msg),
  onReplyMsg: (cb: (msg: string) => any) => {
    const handler: (event: IpcRendererEvent, ...args: any[]) => void = (_, msg: string) => {
      cb(msg)
    }
    ipcRenderer.on('reply-msg', handler)
    return () => {
      ipcRenderer.off('reply-msg', handler)
    }
  },
}
