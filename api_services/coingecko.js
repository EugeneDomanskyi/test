const COINGECKO_URL = 'https://api.coingecko.com/api/v3'

export const getPrices = async (ids) => {
  const stringIds = Object.keys(ids).join(',')
  try {
    const res = await fetch(`${COINGECKO_URL}/coins/markets?vs_currency=usd&ids=${stringIds}&order=market_cap_desc&per_page=${ids.length}&page=1&sparkline=false&locale=en&precision=5`, {cache: 'force-cache'})
    if (!res.ok) {
      return null
    }
    const json = await res.json()
    const result = json.reduce((acc, meta) => {
      const { current_price, high_24h, low_24h, price_change_percentage_24h, total_volume, image } = meta
      const tickerValue = Math.abs(price_change_percentage_24h).toFixed(2)
      return {
        ...acc,
        [ids[meta.id]]: {
          price: current_price,
          high: high_24h,
          low: low_24h,
          volume: total_volume,
          ticker: {
            value: tickerValue,
            type: tickerValue >= 0 ? 'plus' : 'minus',
          },
          image: image
        }
      }
    }, {})
    return result
  } catch (error) {
    return null
  }
}