import { CHAINS } from '@/config'

const BASE_URL = 'https://api.1inch.dev/orderbook/v3.0'

const handler = async (req, res) => {
  const { route, chainCode, statuses, ...params } = req.query

  const segments = (route || []).map(seg => `/${seg}`).join('')
  
  const currentChain = CHAINS.find(chain => chain.code === chainCode)

  const query = queryBuilder(params)

  const result = await fetch(`${BASE_URL}/${currentChain.id}${segments}${query}`, {
    headers: {
      'Authorization': `Bearer AMcNVNc01FRipWFywEwT258QUCFkHWnb`,
      'Accept': 'application/json',
      'content-type': 'application/json',
    }
  })
  // console.log(`${BASE_URL}/${currentChain.id}${segments}${query}`)
  // const contentType = result.headers.get('content-type')
  console.log(result.ok, result.status)
  if (result.ok) {
    let data = await result.json()
    res.status(result.status).json(data)
    return
  }
  
  // console.log('contentType', contentType)
  // if (contentType.includes('application/json')) {
  //   data = await result.json()
  // } else {
  //   data = await result.text()
  // }
  // const json = await result.json()
  // console.log('json', result.ok, result)
  res.status(result.status).send(result.message)
}

const queryBuilder = (data) => {
  const params = new URLSearchParams()
  for (const key in data) {
    if (data[key] != null) {
      if (typeof data[key] == 'object') {
        for (const value of data[key]) {
          params.append(key, value)
        }
      } else {
        params.append(key, data[key])
      }
    }
  }
  return `?${params}`
}

export default handler