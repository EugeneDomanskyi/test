import { getApolloClient, queries } from '@/api_services/graphql'
import { getPrices } from '@/api_services/coingecko'
import coingeckoAssets from '@/public/files/coingecko_ids'

import $token from '@/store/token'

export const getTokens = async (chain, post) => {
  if (chain?.useBackend) {
    const result = await $token.api.backend.all({
      page: post.currentPage,
      pageSize: post.perPage,
      chainId: chain.id,
      sortBy: 'name',
      sortOrder: 'asc',
      filterVal: post?.searchText,
      filterCol: post?.searchField,
    })

    if (result) {
      return result.map(item => ({
        id: item.ContractAddress.toLowerCase(),
        name: item.Name,
        symbol: item.Symbol,
        decimals: item.Decimals,
        image: `https://storage.googleapis.com/token-assets/assets/${chain.code}/${item.ContractAddress.toLowerCase()}.png`,
        totalSupply: null,
        volumeUSD: null,
        totalValueLockedUSD: null,
      }))
    }
  } else {
    const client = getApolloClient(chain.baseUniswapUrl)
    const res = await client.query({
      query: queries.tokens,
      variables: {
        skip: (post.currentPage - 1) * post.perPage,
        orderBy: post.orderBy,
        orderDirection: post.orderDirection,
        searchText: post?.searchText || '',
        usdt: chain.usdtContract,
      },
    })

    if (res?.data && res.data.hasOwnProperty('tokens')) {
      return res.data.tokens
    }
  }

  return []
}

export const getFull = async (chain, token) => {
  const result = await $token.api.coingecko.full({platform: chain.platform, address: token.id})
  if (result) {
    return {
      ...token,
      isFull: true,
      blockchain: chain.code,
      price: result.market_data?.current_price?.usd,
      high: result.market_data?.high_24h?.usd,
      low: result.market_data?.low_24h?.usd,
      volume: result.market_data?.total_volume?.usd,
      tvl: result.market_data?.total_value_locked,
      ticker: {
        value: Math.abs(result.market_data?.price_change_percentage_24h ?? 0).toFixed(2),
        type: ((result.market_data?.price_change_percentage_24h ?? 0) >= 0) ? 'plus' : 'minus',
      },
      image: result.image.large,

      description: result.description?.en,
      tokenCount: result.market_data?.total_supply,
      onSaleCount: result.market_data?.circulating_supply,
      externalUrl: result.links?.homepage[0],
      twitterUrl: result.links?.twitter_screen_name ? `https://twitter.com/${result.links?.twitter_screen_name}` : null,
      genesis_date: result?.genesis_date,
      marketCap: result.market_data?.total_supply * (result.market_data?.current_price?.usd ?? 0),
    }
  }

  return token
}

export const getTokenDayDatas = async (url, ids) => {
  const client = getApolloClient(url)
  const res = await client.query({
    query: queries.tokenDayDatas,
    variables: {
      ids: ids,
      first: ids.length > 0 ? (ids.length * 3) : 1,
    },
  })

  if (res.data.tokenDayDatas) {
    const prices = res.data.tokenDayDatas.reduce((acc, item, _, array) => {
      const [lastDay, prevDay] = array.filter(day => day.token.id === item.token.id)
      if (acc[item.token.id]) {
        return acc
      }

      if (prevDay?.date && lastDay?.date) {
        const priceChanged = prevDay?.priceUSD ? lastDay.priceUSD * 100 / prevDay?.priceUSD - 100 : 0
        return {
          ...acc,
          [item.token.id]: {
            price: Number(lastDay.priceUSD).toFixed(2),
            high: Number(lastDay.high).toFixed(2),
            low: Number(lastDay.low).toFixed(2),
            volume: Number(lastDay.volumeUSD).toFixed(2),
            ticker: {
              value: priceChanged.toFixed(2),
              type: priceChanged >= 0 ? 'plus' : 'minus',
            },
          }
        }
      } else {
        return acc
      }
    }, {})
    
    const usedIds = Object.keys(prices)
    const unusedIds = ids.filter(id => !usedIds.includes(id))
    if (unusedIds.length) {
      for (const id of unusedIds) {
        const res = await client.query({
          query: queries.tokenDayDatas,
          variables: {
            ids: [id],
            first: 2,
          },
        })

        if (res?.data?.tokenDayDatas) {
          const [lastDay, prevDay] = res.data.tokenDayDatas
          if (prevDay?.date && lastDay?.date) {
            const priceChanged = prevDay?.priceUSD ? lastDay.priceUSD * 100 / prevDay?.priceUSD - 100 : 0
            prices[id] = {
              price: Number(lastDay.priceUSD).toFixed(2),
              high: Number(lastDay.high).toFixed(2),
              low: Number(lastDay.low).toFixed(2),
              volume: Number(lastDay.volumeUSD).toFixed(2),
              ticker: {
                value: priceChanged.toFixed(2),
                type: priceChanged >= 0 ? 'plus' : 'minus',
              },
            }
          } else {
            prices[id] = {
              price: 0,
              high: 0,
              low: 0,
              volume: 0,
              ticker: {
                value: 0,
                type: 'plus',
              },
            }
          }
        }
      }
    }

    return prices
  }

  return {}
}

export const fetchPrices = async (chain, tokens) => {
  let coingeckoIds = {}
  let notCoingeckoIds = {}
  if (coingeckoAssets[chain.platform]) {
    coingeckoIds = tokens.reduce((acc, token) => {
      const key = coingeckoAssets[chain.platform][token.id]
      return {
        ...acc,
        ...(key ? {[key]: token.id} : null)
      }
    }, {})

    notCoingeckoIds = tokens.reduce((acc, token) => {
      const key = coingeckoAssets[chain.platform][token.id]
      if ( ! key) {
        const newAcc = [...acc]
        newAcc.push(token.id)
        return newAcc
      }

      return acc
    }, [])
  }

  let tokenIds = []
  let prices = {}
  if (Object.keys(coingeckoIds).length) {
    const pricesCoingecko = await getPrices(coingeckoIds)
    if (pricesCoingecko) {
      if (!Object.keys(notCoingeckoIds).length) {
        return pricesCoingecko
      } else {
        prices = pricesCoingecko
        tokenIds = Object.values(notCoingeckoIds)
      }
    } else {
      tokenIds = tokens.map(token => token.id)
    }
  } else {
    tokenIds = tokens.map(token => token.id)
  }

  let uniswapPrices = {}
  if (chain.baseUniswapUrl) {
    uniswapPrices = await getTokenDayDatas(chain.baseUniswapUrl, tokenIds)
  }
  return {...prices, ...uniswapPrices}
}