import { useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
// import _ from 'lodash'

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

const WrapperExchange = ({children}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  // const blockchain = useSelector($app.get.blockchain)
  const currentToken = useSelector(({$token}) => $token.current)
  const tokenList = useSelector(({$token}) => $token.all)

  // console.log('blockchain', blockchain)

  const [address] = router.query.address || []
  const blockchain = router.query.blockchain
  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(address)

  const currentChain = CHAINS.find(chain => chain.code === blockchain)

  // fetch list for blockchain
  useEffect(() => {
    const post = {
      skip: 0,
      orderBy: 'volumeUSD',
      orderDirection: 'desc',
      searchText: '',
      usdt: currentChain.usdtContract,
    }
    getTokens(currentChain.baseUniswapUrl, post).then(async tokens => {
      dispatch($token.set.all(tokens))
      dispatch($token.set.loading(false))
      const coingeckoIds = tokens.reduce((acc, token) => ({
        ...acc,
        [coingeckoAssets[currentChain.platform][token.id]]: token.id
      }), {})
      const res = await getPrices(coingeckoIds)
      dispatch($token.set.updatedAll(res))
    })
  }, [blockchain])

  // fetch current if address is correct
  useEffect(() => {
    (async () => {
      // if (isAddress && currentChain && currentToken?.id !== address) {
      //   const existInList = tokenList.find(token => token.id === address)
      //   if (!existInList) {
      //     const token = await getToken(currentChain.baseUniswapUrl, address)
      //     if (token) {
      //       dispatch($token.set.current(token))
      //       return
      //     }
      //     setWrongAddress(true)
      //     return
      //   }
      //   dispatch($token.set.current(existInList))
      // } else if (!isAddress) {
      //   setWrongAddress(true)
      // }
    })()
  }, [isAddress, blockchain, address, currentToken?.address])

  return children
}

const isEqual = (prev, next) => {
  return true
}

export default memo(WrapperExchange, isEqual)
