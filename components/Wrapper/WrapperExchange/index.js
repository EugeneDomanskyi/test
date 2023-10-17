import { useEffect, memo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import coingeckoAssets from '@/public/files/coingecko_ids'
import { getApolloClient, queries } from '@/api/graphql'
import { getPrices } from '@/api/coingecko'
import { CHAINS } from '@/config'
import $token from '@/store/token'
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
  const sort = useSelector(({ $token }) => $token.sort)
  const pages = useSelector($token.get.pages)

  const [wrongAddress, setWrongAddress] = useState(false)

  const [address] = router.query.address || []
  const blockchain = router.query.blockchain
  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(address)

  const currentChain = CHAINS.find(chain => chain.code === blockchain)

  const [sortBy, sortDirection] = sort.split(':')

  let orderBy = sortBy.toLowerCase()
  if (orderBy == 'volume') {
    orderBy = 'volumeUSD'
  }

  if (orderBy == 'price') {
    orderBy = 'derivedETH'
  }

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
      dispatch($token.set.loading(false))
      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))
      const coingeckoIds = tokens.reduce((acc, token) => ({
        ...acc,
        [coingeckoAssets[currentChain.platform][token.id]]: token.id
      }), {})
      const res = await getPrices(coingeckoIds)
      dispatch($token.set.updatedAll(res))
    })
  }, [blockchain, sort, pages.current])

  // fetch current if address is correct
  useEffect(() => {
    (async () => {
      if (isAddress && currentChain && currentToken?.id !== address) {
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
      } else if (!isAddress) {
        setWrongAddress(true)
      }
    })()
  }, [isAddress, blockchain, address, currentToken?.address])

  // set current from list
  useEffect(() => {
    if (wrongAddress && tokenList.length && !isMobile) {
      dispatch($token.set.current(tokenList[0]))
      router.replace(`/exchange/${blockchain}/${tokenList[0].id}`)
    }
  }, [wrongAddress, tokenList.length, isMobile])

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

  return children
}

const isEqual = (prev, next) => {
  return true
}

export default memo(WrapperExchange, isEqual)
