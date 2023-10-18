import { useEffect, memo, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import coingeckoAssets from '@/public/files/coingecko_ids'
import { getApolloClient, queries } from '@/api/graphql'
import { getPrices } from '@/api/coingecko'
import { CHAINS } from '@/config'
import $token from '@/store/token'
import $exchange from '@/store/exchange'
import $app from '@/store/app'

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

  useEffect(() => {
    if (storedBlockchain.code !== blockchain) {
      dispatch($token.set.loading(true))
      router.replace(`/exchange/${storedBlockchain.code}/0x`)
    }
  }, [storedBlockchain, blockchain])

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
      const coingeckoIds = tokens.reduce((acc, token) => ({
        ...acc,
        [coingeckoAssets[currentChain.platform][token.id]]: token.id
      }), {})
      const res = await getPrices(coingeckoIds)
      dispatch($token.set.updatedAll(res))
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
        } else {
          const id = {[coingeckoAssets[currentChain.platform][currentToken.id]]: currentToken.id}
          getPrices(id).then(res => {
            dispatch($token.set.updatedCurrent(res[currentToken.id]))
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

  return children
}

const isEqual = (prev, next) => {
  return true
}

export default memo(WrapperExchange, isEqual)
