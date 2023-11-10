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
import { usePropsHelper } from '@/myhooks/props-helper'

const getTokens = async (chain, post) => {
  if (chain?.useBackend) {
    const result = await $token.api.backend.all(post)
    if (result) {
      console.log('1234556', result)
      return result
    }

    return []
  } else {
    const client = getApolloClient(chain.baseUniswapUrl)
    const res = await client.query({
      query: queries.tokens,
      variables: {
        skip: post.skip,
        orderBy: post.orderBy,
        orderDirection: post.orderDirection,
        searchText: post.searchText,
        usdt: post.usdt,
      },
    })
    return res.data.tokens
  }
}

const getTokenDayDatas = async (url, ids) => {
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
          }
        }
      }
    }

    return prices
  }

  return {}
}

const getToken = async (chain, id) => {
  const client = getApolloClient(chain.baseUniswapUrl)
  const res = await client.query({
    query: queries.tokenById,
    variables: {id: id}
  })
  return res.data.token && res.data.token.symbol !== 'unknown' ? res.data.token : null

  // const post = {
  //   page: 1,
  //   pageSize: 1,
  //   chainId: chain.id,
  //   filterCol: 'ContractAddress',
  //   filterVal: id,
  // }
  
  // const result = $token.api.backend.all(post)
  // if (result) {
  //   console.log(result)
  //   return result
  // }

  // return null
}

const WrapperExchange = ({children, _isMobile}) => {
  const { isMobile } = usePropsHelper()
  
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
  const tokensPerPage = 20

  const [sortBy, sortDirection] = sort.split(':')

  let orderBy = sortBy.toLowerCase()
  if (orderBy == 'volume') {
    orderBy = 'volumeUSD'
  }

  if (orderBy == 'price') {
    orderBy = 'derivedETH'
  }

  useEffect(() => {
    if (storedBlockchain.code !== blockchain) {
      const newBlockchain = ['ethereum', 'polygon', 'mumbai', 'arbitrum', 'bsc', 'avalanche'].includes(storedBlockchain.code) ? storedBlockchain.code : blockchain
      dispatch($app.set.code(newBlockchain))
      dispatch($token.set.loading(true))
      router.replace(`/exchange/${newBlockchain}/0x`)
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
    if (currentChain.code !== blockchain) {
      return
    }

    let post = {}
    if (currentChain?.useBackend) {
      post = {
        page: pages.current,
        pageSize: tokensPerPage,
        chainId: currentChain.id,
        sortBy: orderBy,
        sortOrder: sortDirection.toLowerCase(),
      }
    } else {
      post = {
        skip: (pages.current - 1) * tokensPerPage,
        orderBy: orderBy,
        orderDirection: sortDirection.toLowerCase(),
        searchText: '',
        usdt: currentChain.usdtContract,
      }
    }

    getTokens(currentChain, post).then(async tokens => {
      dispatch($token.set.all(tokens))
      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))
      dispatch($token.set.loading(false))

      const prices = await fetchPrices(tokens)
      dispatch($token.set.updatedAll(prices))
    })
  }, [currentChain.baseUniswapUrl, sort, pages.current, currentChain.code, blockchain])

  // fetch current if address is correct
  useEffect(() => {
    (async () => {
      if (isAddress && (currentChain.code === blockchain) && currentToken?.id !== address) {
        const existInList = tokenList.find(token => token.id === address)
        if (!existInList) {
          const token = await getToken(currentChain, address)
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
    if (currentToken?.id && currentToken.id === address && isAddress) {
      $exchange.api.get.tokenChartData(address, blockchain, activeInterval.seconds).then(res => {
        if (res) {
          dispatch($exchange.set.chartData({type: 'tokens', data: res.data}))
          return
        }
        dispatch($exchange.set.chartData({type: 'tokens', data: []}))
      })
    }
  }, [address, currentToken?.id, blockchain, activeInterval.seconds, isAddress])

  const fetchPrices = async (tokens) => {
    const coingeckoIds = tokens.reduce((acc, token) => {
      const key = coingeckoAssets[currentChain.platform][token.id]
      return {
        ...acc,
        ...(key ? {[key]: token.id} : null)
      }
    }, {})

    const notCoingeckoIds = tokens.reduce((acc, token) => {
      const key = coingeckoAssets[currentChain.platform][token.id]
      if ( ! key) {
        const newAcc = [...acc]
        newAcc.push(token.id)
        return newAcc
      }

      return acc
    }, [])
    
    const pricesCoingecko = await getPrices(coingeckoIds)
    let tokenIds = []
    let prices = {}
    if (pricesCoingecko) {
      if (!notCoingeckoIds.length) {
        return pricesCoingecko
      } else {
        prices = pricesCoingecko
        tokenIds = notCoingeckoIds
      }
    } else {
      tokenIds = tokens.map(token => token.id)
    }

    const uniswapPrices = await getTokenDayDatas(currentChain.baseUniswapUrl, tokenIds)
    return {...prices, ...uniswapPrices}
  }

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

      // const post = {
      //   page: 1,
      //   pageSize: tokensPerPage,
      //   chainId: currentChain.id,
      //   sortBy: orderBy,
      //   sortOrder: sortDirection.toLowerCase(),
      //   filterCol: 'name',
      //   filterVal: searchText,
      // }

      results = await getTokens(currentChain, post)
    }
    dispatch($token.set.searched(results))
    dispatch($token.set.loading(false))

    const prices = await fetchPrices(results)
    dispatch($token.set.updatedSearched(prices))
  }

  return children
}

const isEqual = (prev, next) => {
  return true
}

export default memo(WrapperExchange, isEqual)
