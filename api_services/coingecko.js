const COINGECKO_URL = 'https://api.coingecko.com/api/v3'

export const getPrices = async (ids) => {
  const stringIds = Object.keys(ids).join(',')
  const res = await fetch(`${COINGECKO_URL}/coins/markets?vs_currency=usd&ids=${stringIds}&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en&precision=5`, {cache: 'force-cache'})
  const json = await res.json()
  const result = json.reduce((acc, meta) => {
    const { current_price, high_24h, low_24h, price_change_percentage_24h, total_volume, image } = meta
    return {
      ...acc,
      [ids[meta.id]]: { current_price, high_24h, low_24h, price_change_percentage_24h, total_volume, image }
    }
  }, {})
  return result
}