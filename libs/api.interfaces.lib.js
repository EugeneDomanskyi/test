const INCH_BASE_URL = 'https://limit-orders.1inch.io/v3.0'

const Interface = {
  Inch: {
    request: async (uri, method = 'GET', data = {}) => {
      const options = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
        },
      }
    
      let query = ''
    
      if (data) {
        if (method === 'GET') {
          query = queryBuilder(data)
        } else {
          options.body = JSON.stringify(data)
        }
      }
      const response = await fetch(`${INCH_BASE_URL}/${uri}${query}`, options)
      if (response.ok) {
        return responseHandler(response)
      }
      return errorHandler(response)
    }
  }
}

const responseHandler = async (response) => {
  return await response.json()
}

const errorHandler = async (response) => {
  // console.log(response)
  return null
}

const queryBuilder = (data) => {
  const params = new URLSearchParams()
  for (const key in data) {
    if (data[key] != null) {
      if (typeof data[key] == 'object') {
        if (Array.isArray(data[key])) {
          params.append(key, `[${data[key].toString()}]`)
        }
        
        // for (const value of data[key]) {
        //   params.append(key, value)
        // }
      } else {
        params.append(key, data[key])
      }
    }
  }
  return `?${params}`
}

export default Interface
