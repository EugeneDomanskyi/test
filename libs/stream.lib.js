import { CHAINS } from '@/config'

let socket = null
let connectResolver = null
let currentChain = null
let subscribeList = []
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
        subscribeList.forEach(post => {
          socket.send(JSON.stringify(post))
        })
        subscribeList = []
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
      if (currentChain == blockchain) {
        return true
      }

      currentChain = blockchain
      return new Promise(resolve => {
        const network = CHAINS.find(chain => chain.code === blockchain)
        if (!network.wsReservoirUrl) {
          return
        }
        connectResolver = resolve
        socket = new WebSocket(`${network.wsReservoirUrl}?api_key=${process.env.NEXT_PUBLIC_RESERVOIR_API_KEY}`)
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

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        subscribeList.push(post)
      } else {
        socket.send(JSON.stringify(post))
      }
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
