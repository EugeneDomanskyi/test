const BASE_URL = 'https://api.1inch.dev/orderbook'

const handler = async (req, res) => {
  const { route, chainCode, statuses, ...params } = req.query

  const segments = (route || []).map(seg => `/${seg}`).join('')

  const query = queryBuilder(params)
  console.log(`${BASE_URL}${segments}${query}`)
  const result = await fetch(`${BASE_URL}${segments}${query}`, {
    headers: {
      'Authorization': `Bearer r2tJonsQiCiVq8Dr0OznOV7XbuZP14Bq`,
      'Accept': 'application/json',
      'content-type': 'application/json',
    }
  })

  if (result.ok) {
    const json = await result.json()
    res.status(result.status).json(json)
    return
  }
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