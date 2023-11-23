
import { toast } from 'react-toastify'

const WS_URL = 'wss://v2.betora.vip/ws'

class Socket {
  constructor() {
    this.socket = null
    this.callbacks = {}
  }

  init = async () => {
    return new Promise(resolve => {
      this.socket = new WebSocket(WS_URL)
      this.socket.onmessage = this.handleMessage
      this.socket.onopen = resolve
    })
  }

  on = (event, cb) => {
    this.callbacks[event] = cb
  }

  subscribe = (channelId) => {
    this.socket.send(JSON.stringify({action: 'subscribe', channelId: channelId}))
  }

  unsubscribe = (channelId) => {
    this.socket.send(JSON.stringify({action: 'unsubscribe', channelId: channelId}))
  }

  handleMessage = (res) => {
    const json = JSON.parse(res.data)
    if (this.callbacks[json.action]) {
      this.callbacks[json.action](json.data)
      this.handleAction(json)
    }
  }

  handleAction = ({action, data}) => {
    switch (action) {
      case 'order_placed':
        toast.success('Order placed successfully')
        break
      case 'order_filled':
        toast.success('Order filled successfully')
        break
    }
  }
}

export default new Socket()