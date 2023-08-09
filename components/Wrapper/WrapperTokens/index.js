import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { ApolloClient, InMemoryCache } from '@apollo/client'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $token, { template } from '@/store/token'

const getApolloClient = (code) => {
  let uri = null
  switch (code) {
    case 'ethereum':
      uri = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
      break
    case 'polygon':
      uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon'
      break
    case 'arbitrum':
      uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one'
      break
    case 'optimism':
      uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis'
      break
    default:
      uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon'
      break
  }

  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  return client
}

const WrapperTokens = ({ children }) => {
  const router = useRouter()
  const [queryTokenId] = router.query.tokenId || []

  const { network } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const blockchains = useSelector(({$app}) => $app.blockchains)

  const tokens = useSelector(({ $token }) => $token.all)
  const searched = useSelector(({ $token }) => $token.searched)
  const fetching = useSelector(({ $token }) => $token.fetching)
  const current = useSelector(({ $token }) => $token.current)
  const list = useSelector(({ $token }) => $token.list)
  const sort = useSelector(({ $token }) => $token.sort)
  const search = useSelector(({ $token }) => $token.search)
  const pages = useSelector($token.get.pages)

  const [isReady, setIsReady] = useState(false)
  const [isList, setIsList] = useState(false)

  const mounted = useRef(false)
  const sortRef = useRef(sort)
  const searchRef = useRef(search)
  const pageRef = useRef(pages.current)
  const blockchainCode = useRef(blockchain.code)
  let apollo = getApolloClient(blockchainCode.current)

  useEffect(() => {
    (async () => {
      const tempList = await $token.api.coingecko.list({ include_platform: true })
      if (tempList) {
        const platforms = blockchains.map(item => item.platform)
        dispatch($token.set.list(tempList.filter(item => {
          return platforms.some(el => item.platforms.hasOwnProperty(el))
        })))
      }

      setIsList(true)
    })()
  }, [])

  useEffect(() => {
    if (router.isReady && isList) {
      setIsReady(true)
    }
  }, [router.isReady, isList])

  useEffect(() => {
    if (isReady && fetching) {
      getTokenList(pages.current, sort, search)
      dispatch($token.set.fetching(false))
    }
  }, [isReady, fetching])

  const getTokenList = async (page, sortType, searchText) => {
    dispatch($token.set.loading(true))

    const [sortBy, sortDirection] = sortType.split(':')
    const orderDirection = sortDirection.toLowerCase()

    let orderBy = sortBy.toLowerCase()
    if (orderBy == 'volume') {
      orderBy = 'volumeUSD'
    }

    if (orderBy == 'price') {
      orderBy = 'derivedETH'
    }

    const result = await apollo.query({
      query: $token.query.tokens,
      variables: {
        skip: searchText != '' ? 0 : (page - 1) * 10,
        orderBy,
        orderDirection,
        searchText,
      },
    })

    if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('tokens')) {
      const tempTokens = result.data.tokens

      const info = await getInfo(tempTokens)

      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))

      const tempAll = tempTokens.map(item => {
        return {
          basic: item,
          blockchain: blockchainCode.current,
          info: info.find(el => el.address.toLowerCase() == item.id.toLowerCase()),
        }
      })

      if (searchText == '') {
        dispatch($token.set.searched([]))
        dispatch($token.set.all(tempAll))
      } else {
        dispatch($token.set.searched(tempAll))
        dispatch($token.set.searching(true))
      }

      if (! current?.id) {
        const [first] = tempTokens
        router.replace(first.id, undefined, { scroll: false })
      }
    }

    mounted.current = true
    dispatch($token.set.loading(false))
  }

  const getInfo = async (tokens) => {
    const platform = network(blockchainCode.current)?.platform
    const addresses = tokens.map(item => item.id.toLowerCase())

    const idToAddressList = addresses.map(address => {
      const foundItem = list.find(item => {
        return item.platforms.hasOwnProperty(platform) && item.platforms[platform].toLowerCase() == address
      })
      
      return foundItem ? { id: foundItem.id, address } : null
    }).filter(item => item != null)

    let result = []
    if (idToAddressList.length) {
      const tempResult = await $token.api.coingecko.info({ vs_currency: 'usd', ids: idToAddressList.map(item => item.id).join(',') })
      if (tempResult && tempResult.length) {
        result = tempResult.map(item => {
          const address = idToAddressList.find(el => el.id == item.id)?.address

          return {
            ...item,
            address,
          }
        })
      }
    }

    return result
  }

  useEffect(() => {
    (async () => {
      if (isReady) {
        let tempTokenId = null
        const temp = window.location.pathname.split('tokens')
        if (temp.length > 1) {
          tempTokenId = temp[1].replace(/^\/|\/$/g, '') || null
        }
        
        const realTokenId = queryTokenId ?? tempTokenId
        if ( ! realTokenId && ! current?.id && tokens.length) {
          const [first] = tokens
          router.replace(first.id, undefined, { scroll: false })
          return
        }

        if (realTokenId) {
          const currentToken = await getToken(realTokenId)
          dispatch($token.set.current(currentToken))
          dispatch($token.set.update(currentToken))
        }

        if ( ! tokens.length) {
          dispatch($token.set.fetching(true))
        }
      }
    })()
  }, [isReady, queryTokenId])

  const getToken = async (id) => {
    let token = tokens.find(item => item.id.toLowerCase() == id.toLowerCase())
    if ( ! token) {
      token = searched.find(item => item.id.toLowerCase() == id.toLowerCase())
    }

    if ( ! token) {
      const result = await apollo.query({
        query: $token.query.token,
        variables: {
          id,
        },
      })

      if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('token') && result.data.token != null) {
        token = {
          basic: result.data.token,
          blockchain: blockchainCode.current,
        }
      } else {
        let tokenWasFound = false
        for (const chain of blockchains) {
          if ( ! tokenWasFound && chain.code != blockchainCode.current) {
            apollo = getApolloClient(chain.code)
            const result = await apollo.query({
              query: $token.query.token,
              variables: {
                id,
              },
            })

            if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('token')) {
              blockchainCode.current = chain.code
              dispatch($app.set.code(chain.code))
              tokenWasFound = true

              token = {
                basic: result.data.token,
                blockchain: chain.code,
              }
            }
          }
        }
      }
    }

    if (token && ! token.isFull) {
      const address = (token?.id ?? token?.basic?.id).toLowerCase()
      const full = await $token.api.coingecko.full({ platform: network(blockchainCode.current)?.platform, address })
      token = {
        ...token,
        full,
      }
    }

    return template(token ?? {})
  }

  useEffect(() => {
    if (mounted.current && blockchain.code != blockchainCode.current) {
      blockchainCode.current = blockchain.code
      apollo = getApolloClient(blockchain.code)
      dispatch($token.set.fetching(true))
    }
  }, [blockchain.code])

  useEffect(() => {
    if (mounted.current && sort != sortRef.current) {
      sortRef.current = sort
      dispatch($token.set.fetching(true))
    }
  }, [mounted.current, sort])

  useEffect(() => {
    if (mounted.current && search != searchRef.current) {
      searchRef.current = search
      if (search != '') {
        dispatch($token.set.fetching(true))
      } else {
        dispatch($token.set.searching(false))
      }
    }
  }, [mounted.current, search])

  useEffect(() => {
    if (mounted.current && pages.current != pageRef.current) {
      pageRef.current = pages.current
      dispatch($token.set.fetching(true))
    }
  }, [mounted.current, pages])

  return children
}

export default WrapperTokens