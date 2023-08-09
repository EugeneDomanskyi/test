const BLOCKCHAIN_URL = {
  polygon: 'wss://ws-polygon.reservoir.tools',
  ethereum: 'wss://ws.reservoir.tools',
  goerli: 'wss://ws.dev.reservoir.tools',
}

let socket = null
let connectResolver = null
const callbacks = {
  'collection.created': [],
  'collection.updated': [],
  'sale.created': [],
  'sale.updated': [],
  'sale.deleted': [],
  'ask.created': [],
  'ask.updated': [],
  'bid.created': [],
  'bid.updated': [],
}

const Stream = () => {
  const messageHandler = async (e) => {
    let string = e.data
    if (typeof string === 'object') {
      string = await string.text()
    }
    const json = JSON.parse(string)
    switch (json.type) {
      case 'connection':
        connectResolver(json.status)
        break
      case 'subscribe':
        break
      case 'event':
        callbacks[json.event].forEach(callback => {
          callback(json.event, json.data)
        })
        break
      default:
        return
    }
  }

  return {
    connect: (blockchain) => {
      return new Promise(resolve => {
        if (!BLOCKCHAIN_URL[blockchain]) {
          return
        }
        connectResolver = resolve
        socket = new WebSocket(`${BLOCKCHAIN_URL[blockchain]}?api_key=${process.env.NEXT_PUBLIC_RESERVOIR_API_KEY}`)
        socket.onmessage = messageHandler
      })
    },
    on: (event, callback) => {
      const [_, eventAction] = event.split('.')
      if (eventAction) {
        // callbacks[event] = [...callbacks[event], callback]
        callbacks[event] = [callback]
        return
      }
      Object.entries(callbacks).forEach(([eventKey, eventCallbacks]) => {
        const [type, action] = eventKey.split('.')
        if (type === event) {
          const eventName = `${event}.${action}`
          // callbacks[eventName] = [...eventCallbacks, callback]
          callbacks[eventName] = [callback]
        }
      })
    },
    subscribe: (event, contracts, params = {}) => {
      const post = {
        type: 'subscribe',
        event: event,
        filters: {
          contract: contracts,
          ...params,
        }
      }
      socket.send(JSON.stringify(post))
    },
    unsubscribe: (event) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        return
      }
      const post = {
        type: 'unsubscribe',
        event: event,
      }
      socket.send(JSON.stringify(post))
    }
  }
}

export default Stream()
