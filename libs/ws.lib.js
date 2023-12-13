const WS_URL = 'wss://v2.betora.vip/ws'
// const WS_URL = 'ws://localhost:8080/ws'

class Socket {
  constructor() {
    this.socket = null
    this.callbacks = {}
    this.handleAction = null
  }

  init = async (callback) => {
    return new Promise(resolve => {
      this.socket = new WebSocket(WS_URL)
      this.socket.onmessage = this.handleMessage
      this.socket.onopen = resolve
      this.handleAction = callback
    })
  }

  on = (event, cbId, cb) => {
    if (!this.callbacks[event]) {
      this.callbacks[event] = {}
    }
    this.callbacks[event][cbId] = cb
  }

  subscribe = (channelId) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({action: 'subscribe', channelId: channelId}))
    }
  }

  unsubscribe = (channelId) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({action: 'unsubscribe', channelId: channelId}))
    }
  }

  handleMessage = (res) => {
    const json = JSON.parse(res.data)
    if (this.callbacks[json.action]) {
      Object.values(this.callbacks[json.action]).forEach(cb => {
        cb(json.data)
      })
    }
    this.handleAction(json)
  }
}

export default new Socket()