import { useEffect, memo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import { getTokens, fetchPrices } from '@/api_services/tokens'
import { CHAINS } from '@/config'
import $token from '@/store/token'
import $exchange from '@/store/exchange'
import $app from '@/store/app'
import { usePropsHelper } from '@/myhooks/props-helper'

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

  const [urlAddress] = router.query.address || []
  const address = urlAddress.toLowerCase()
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
    (async () => {
      if (currentChain.code !== blockchain) {
        return
      }

      const post = {
        currentPage: pages.current,
        perPage: tokensPerPage,
        orderBy: orderBy,
        orderDirection: sortDirection.toLowerCase(),
      }

      const tokens = await getTokens(currentChain, post)
      dispatch($token.set.all(tokens))
      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))

      const prices = await fetchPrices(currentChain, tokens)
      dispatch($token.set.updatedAll(prices))

      dispatch($token.set.loading(false))
    })()
  }, [currentChain.baseUniswapUrl, sort, pages.current, currentChain.code, blockchain])

  // fetch current if address is correct
  useEffect(() => {
    (async () => {
      if (isAddress && (currentChain.code === blockchain) && currentToken?.id !== address) {
        const existInList = tokenList.find(token => token.id === address)
        if (!existInList) {
          const post = {
            currentPage: 1,
            perPage: 1,
            orderBy: orderBy,
            orderDirection: sortDirection.toLowerCase(),
            searchText: address,
            searchField: 'contract_address',
          }

          const [token] = await getTokens(currentChain, post)
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

  // update price and data for current
  useEffect(() => {
    (async () => {
      if (currentToken?.id && currentToken.id === address && tokenList.length) {
        if (tokenList.some(token => token.price) && !currentToken.price) {
          const exist = tokenList.find(token => token.id === currentToken.id)
          if (exist) {
            dispatch($token.set.updatedCurrent(exist))
          } else {
            const prices = await fetchPrices(currentChain, [currentToken])
            dispatch($token.set.updatedCurrent(prices[currentToken.id]))
          }
        }
      }
    })()
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

  const searchTokens = async (searchText) => {
    dispatch($token.set.searching(true))
    dispatch($token.set.loading(true))

    const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(searchText)
    const post = {
      currentPage: 1,
      perPage: tokensPerPage,
      orderBy: orderBy,
      orderDirection: sortDirection.toLowerCase(),
      searchText: searchText,
      searchField: isAddress ? 'contract_address' : 'name',
    }

    const results = await getTokens(currentChain, post)
    dispatch($token.set.searched(results))

    const prices = await fetchPrices(currentChain, results)
    dispatch($token.set.updatedSearched(prices))

    dispatch($token.set.loading(false))
  }

  return children
}

const isEqual = (prev, next) => {
  return true
}

export default memo(WrapperExchange, isEqual)
