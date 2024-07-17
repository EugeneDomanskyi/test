class Socket {
  constructor() {
    this.socket = null
    this.callbacks = {}
    this.channels = []
    this.handleAction = null
  }

  init = async (callback, onClose, isBid = false) => {
    return new Promise(resolve => {
      this.socket = new WebSocket(isBid ? process.env.NEXT_PUBLIC_BID_WS_URL : process.env.NEXT_PUBLIC_WS_URL)
      this.socket.onmessage = this.handleMessage
      this.socket.onopen = () => {
        this.channels.forEach((channelId) => {
          this.subscribe(channelId)
        })

        resolve()
      }
      this.socket.onclose = onClose
      this.handleAction = callback
    })
  }

  isOpen = () => {
    return this.socket?.readyState === WebSocket.OPEN
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

      if (!this.channels.includes(channelId)) {
        this.channels.push(channelId)
      }
    }
  }

  unsubscribe = (channelId) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({action: 'unsubscribe', channelId: channelId}))

      const index = this.channels.indexOf(channelId)
      if (index !== -1) {
        this.channels.splice(index, 1)
      }
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