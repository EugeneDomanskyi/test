const TOKENS_URL = 'https://portfolio.1inch.io/assets/tokens-list/'
const PORTFOLIO_URL = 'https://api.1inch.dev/portfolio/v3/portfolio/overview/'
const PORTFOLIO_TIMERANGE = '1day'
const PORTFOLIO_PROTOCOL = 'erc20'

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

  for (const key of params.keys()) {
    if (params.has(key)) {
      return `?${params}`
    }
  }
  
  return ''
}

const handler = async (req, res) => {
  const [wallet, chainId, chainCode] = req.query.route
  
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
    },
  }

  const query = queryBuilder({
    addresses: wallet,
    timerange: PORTFOLIO_TIMERANGE,
    protocol: PORTFOLIO_PROTOCOL,
    chain_id: chainId,
  })

  try {
    const calls = [
      fetch(`${TOKENS_URL}${chainCode}-tokens.json?v=2`, options),
      fetch(`${PORTFOLIO_URL}assets/details${query}`, options),
    ]

    const [tokensResponse, detailsResponse] = await Promise.all(calls)
    if (tokensResponse?.ok) {
      const tokens = await tokensResponse.json()

      if (detailsResponse?.ok) {
        const details = await detailsResponse.json()
        const result = details.filter(item => item.chain_id == chainId).map(item => {
          const info = tokens.find(el => el.address == item.contract_address)

          if (!info?.image) {
            if (info.symbol == 'USDT') {
              info.image = 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
            }
          }

          return {
            ...item,
            info,
          }
        })

        res.status(200).json(result)
        return
      }
    }

    res.status(500).json({
      error: '1inch Server Error'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

export default handler