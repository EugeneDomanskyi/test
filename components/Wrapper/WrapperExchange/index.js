import { useEffect, memo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchToken } from '@wagmi/core'

import coingeckoAssets from '@/public/files/coingecko_ids'
import { getApolloClient, queries } from '@/api_services/graphql'
import { getPrices } from '@/api_services/coingecko'
import { CHAINS } from '@/config'
import $token from '@/store/token'
import $exchange from '@/store/exchange'
import $app from '@/store/app'

// const temp = coinmarketAssets.reduce((acc, token) => {
//   const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(token.platform.token_address)
//   if (!isAddress) {
//     return acc
//   }
//   const platform = token.platform.slug
//   const platformData = {...acc[platform], [token.platform.token_address]: token.id}
//   return {
//     ...acc,
//     [platform]: platformData
//   }
// }, {})


const getTokens = async (url, {skip, orderBy, orderDirection, searchText, usdt}) => {
  const client = getApolloClient(url)
  const res = await client.query({
    query: queries.tokens,
    variables: {
      skip: skip,
      orderBy: orderBy,
      orderDirection: orderDirection,
      searchText: searchText,
      usdt: usdt,
    },
  })
  return res.data.tokens
}

const getTokenDayDatas = async (url, ids) => {
  const client = getApolloClient(url)
  const res = await client.query({
    query: queries.tokenDayDatas,
    variables: {
      ids: ids,
    },
  })
  if (res.data.tokenDayDatas) {
    return res.data.tokenDayDatas.reduce((acc, item, _, array) => {
      const [lastDay, prevDay] = array.filter(day => day.token.id === item.token.id)
      if (acc[item.token.id]) {
        return acc
      }
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
    }, {})
    
  }
  return {}
}

const getToken = async (url, id) => {
  const client = getApolloClient(url)
  const res = await client.query({
    query: queries.tokenById,
    variables: {id: id}
  })
  return res.data.token && res.data.token.symbol !== 'unknown' ? res.data.token : null
}

const WrapperExchange = ({children, isMobile}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const currentToken = useSelector(({$token}) => $token.current)
  const tokenList = useSelector(({$token}) => $token.all)
  const loading = useSelector(({$token}) => $token.loading)
  const sort = useSelector(({ $token }) => $token.sort)
  const search = useSelector(({$token}) => $token.search)
  const pages = useSelector($token.get.pages)
  const activeInterval = useSelector(({$exchange}) => $exchange.interval)
  const storedBlockchain = useSelector($app.get.blockchain)

  const [wrongAddress, setWrongAddress] = useState(false)

  const [address] = router.query.address || []
  const blockchain = router.query.blockchain
  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(address)
  const emptyAddress = address === '0x'

  const currentChain = CHAINS.find(chain => chain.code === storedBlockchain.code)

  const [sortBy, sortDirection] = sort.split(':')

  let orderBy = sortBy.toLowerCase()
  if (orderBy == 'volume') {
    orderBy = 'volumeUSD'
  }

  if (orderBy == 'price') {
    orderBy = 'derivedETH'
  }

  // useEffect(() => {
    
  //   const temp = Object.entries(assets).reduce((acc, [address, token]) => {
  //     const updated = tempAssets[address] ? {...token, ...tempAssets[address]} : token
  //     return {
  //       ...acc,
  //      [address]: updated
  //     }
  //   }, {})
  //   console.log(temp)
  //   const temp = Object.values(data.data).reduce((acc, token) => {
  //     if (!token.platform?.token_address) {
  //       return acc
  //     }
  //     const info = {
  //       "id": token.platform.token_address,
  //       "address": token.platform.token_address,
  //       "image": token.logo,
  //       "name": token.name,
  //       "symbol": token.symbol,
  //       "currency": "USDT",
  //       "description": token.description,
  //       "discordUrl": null,
  //       ...(token.urls && Array.isArray(token.urls.website) ? {"externalUrl": token.urls.website[0]} : {}),
  //       ...(token.twitter_username ? {"twitterUrl": `https://twitter.com/${token.twitter_username}`} : {}),
  //       "openseaVerificationStatus": false
  //   }
  //     return {
  //       ...acc,
  //       [token.platform.token_address.toLowerCase()]: info
  //     }
  //   }, {})
  //   console.log(coinmarketAssets.ethereum)
  //   const ids = Object.values(coinmarketAssets.ethereum).slice(0, 100)
  //   console.log(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${ids.join(',')}`)
  //   console.log(temp)
  // }, [])

  useEffect(() => {
    if (storedBlockchain.code !== blockchain) {
      dispatch($token.set.loading(true))
      router.replace(`/exchange/${storedBlockchain.code}/0x`)
    }
  }, [storedBlockchain, blockchain])

  useEffect(() => {
    if (search) {
      searchTokens(search)
    } else {
      dispatch($token.set.searching(false))
    }
  }, [search])

  // fetch list for blockchain
  useEffect(() => {
    const post = {
      skip: (pages.current - 1) * 10,
      orderBy: orderBy,
      orderDirection: sortDirection.toLowerCase(),
      searchText: '',
      usdt: currentChain.usdtContract,
    }
    
    getTokens(currentChain.baseUniswapUrl, post).then(async tokens => {
      dispatch($token.set.all(tokens))
      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))
      dispatch($token.set.loading(false))

      const coingeckoIds = tokens.reduce((acc, token) => {
        const key = coingeckoAssets[currentChain.platform][token.id]
        return {
          ...acc,
          ...(key ? {[key]: token.id} : null)
        }
      }, {})
      const pricesCoingecko = await getPrices(coingeckoIds)
      if (pricesCoingecko) {
        dispatch($token.set.updatedAll(pricesCoingecko))
        return
      }
      const tokenIds = tokens.map(token => token.id)
      const prices = await getTokenDayDatas(currentChain.baseUniswapUrl, tokenIds)
      dispatch($token.set.updatedAll(prices))
    })
  }, [currentChain.baseUniswapUrl, sort, pages.current])

  // fetch current if address is correct
  useEffect(() => {
    (async () => {
      if (isAddress && (currentChain.code === blockchain) && currentToken?.id !== address) {
        const existInList = tokenList.find(token => token.id === address)
        if (!existInList) {
          const token = await getToken(currentChain.baseUniswapUrl, address)
          if (token) {
            dispatch($token.set.current(token))
            return
          }
          setWrongAddress(true)
          return
        }
        dispatch($token.set.current(existInList))
      } else if (!isAddress && !emptyAddress) {
        setWrongAddress(true)
      }
    })()
  }, [isAddress, blockchain, address, currentToken?.address])

  // set current from list
  useEffect(() => {
    if ((wrongAddress || !isAddress) && (storedBlockchain.code === blockchain) && tokenList.length && !isMobile && !loading) {
      dispatch($token.set.current(tokenList[0]))
      router.replace(`/exchange/${blockchain}/${tokenList[0].id}`)
    }
  }, [wrongAddress, tokenList.length, blockchain, storedBlockchain.code, isMobile, loading])

  // update price for current
  useEffect(() => {
    if (currentToken?.id && currentToken.id === address && tokenList.length) {
      if (tokenList.some(token => token.price) && !currentToken.price) {
        const exist = tokenList.find(token => token.id === currentToken.id)
        if (exist) {
          dispatch($token.set.updatedCurrent(exist))
        } else if (coingeckoAssets[currentChain.platform][currentToken.id]) {
          const id = {[coingeckoAssets[currentChain.platform][currentToken.id]]: currentToken.id}
          getPrices(id).then(async res => {
            if (res) {
              dispatch($token.set.updatedCurrent(res[currentToken.id]))
            } else {
              const prices = await getTokenDayDatas([currentToken.id])
              dispatch($token.set.updatedCurrent(prices[currentToken.id]))
            }
          })
        }
      }
    }
  }, [tokenList, currentToken?.address, address])

  // fetch chart data
  useEffect(() => {
    if (currentToken?.id && currentToken.id === address && isAddress && !wrongAddress) {
      $exchange.api.get.tokenChartData(address, blockchain, activeInterval.seconds).then(res => {
        if (res) {
          dispatch($exchange.set.chartData({type: 'tokens', data: res.data}))
          return
        }
        dispatch($exchange.set.chartData({type: 'tokens', data: []}))
      })
    }
  }, [address, wrongAddress, currentToken?.id, blockchain, activeInterval.seconds, isAddress])

  const searchTokens = async (searchText) => {
    dispatch($token.set.searching(true))
    dispatch($token.set.loading(true))
    const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(searchText)
    let results = []
    if (isAddress) {
      const res = await fetchToken({address: searchText, chainId: currentChain.id})
      const tokenData = {
        ...res,
        totalSupply: res.totalSupply.formatted,
        id: res.address,
      }
      results = [tokenData]
    } else {
      const post = {
        skip: 0,
        orderBy: orderBy,
        orderDirection: sortDirection.toLowerCase(),
        searchText: searchText,
        usdt: currentChain.usdtContract,
      }
      results = await getTokens(currentChain.baseUniswapUrl, post)
    }
    dispatch($token.set.searched(results))
    dispatch($token.set.loading(false))
    const coingeckoIds = results.reduce((acc, token) => {
      const key = coingeckoAssets[currentChain.platform][token.id]
      return {
        ...acc,
        ...(key ? {[key]: token.id} : null)
      }
    }, {})
    const prices = await getPrices(coingeckoIds)
    dispatch($token.set.updatedSearched(prices))
  }

  return children
}

const isEqual = (prev, next) => {
  return true
}

export default memo(WrapperExchange, isEqual)
