import { readContract } from '@wagmi/core'

const INCH_URL = 'https://limit-orders.1inch.io/v3.0'

const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'content-type': 'application/json',
  },
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

const getDecimals = async (address, chainId) => {
  const abi = {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
  const res = await readContract({
    address: address,
    abi: [abi],
    functionName: 'decimals',
    chainId: chainId,
  })
  return res
}

const handler = async (req, res) => {
  const [chainId, makerAsset, takerAsset, price, amount, side] = req.query.route
  const query = queryBuilder({
    makerAsset,
    takerAsset,
    limit: 500,
    statuses: '[1]',
    sortBy: 'takerRate',
  })
  const response = await fetch(`${INCH_URL}/${chainId}/all${query}`, options)
  if (response.ok) {
    const json = await response.json()
    if (json && Array.isArray(json)) {
      const makerDecimals = await getDecimals(makerAsset, chainId)
      const takerDecimals = await getDecimals(takerAsset, chainId)
      console.log('decimals', makerDecimals, takerDecimals)
      res.status(200).json({})
    }
  }
  res.status(400).json({})
}

export default handler
