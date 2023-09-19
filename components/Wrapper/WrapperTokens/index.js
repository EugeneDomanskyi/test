import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { ApolloClient, InMemoryCache } from '@apollo/client'

import useWalletConnect from '@/myhooks/wallet-connect'

import { putAssetsFile, getAssetsFile } from '@/libs/aws.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'
import $token, { template, staticTemplate } from '@/store/token'

const getApolloClient = (chain) => {
  const client = new ApolloClient({
    uri: chain.baseUniswapUrl,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  return client
}

const WrapperTokens = ({ children }) => {
  const router = useRouter()
  const [queryBlockchainCode, queryTokenId] = router.query?.segments?.slice(-2) || []

  const { getBasicInfo, isContractAddress } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector($app.get.pageBlockchains('tokens'))

  const tokens = useSelector(({ $token }) => $token.all)
  const searched = useSelector(({ $token }) => $token.searched)
  const fetching = useSelector(({ $token }) => $token.fetching)
  const current = useSelector(({ $token }) => $token.current)
  const list = useSelector(({ $token }) => $token.list)
  const infoList = useSelector(({ $token }) => $token.infoList)
  const sort = useSelector(({ $token }) => $token.sort)
  const search = useSelector(({ $token }) => $token.search)
  const pages = useSelector($token.get.pages)

  const [isReady, setIsReady] = useState(false)
  const [isList, setIsList] = useState(false)
  const [isBlockchain, setIsBlockchain] = useState(false)

  const sortRef = useRef(sort)
  const searchRef = useRef(search)
  const pageRef = useRef(pages.current)
  const blockchainCode = useRef(blockchain.code)
  const apollo = useRef(getApolloClient(blockchain))

  useEffect(() => {
    (async () => {
      // const tempList = await $token.api.coingecko.list({ include_platform: true })
      // if (tempList) {
      //   const platforms = pageBlockchains.map(item => item.platform)
      //   dispatch($token.set.list(tempList.filter(item => {
      //     return platforms.some(el => item.platforms.hasOwnProperty(el))
      //   })))
      // }

      const infoList = await $token.api.coingecko.local()
      dispatch($token.set.infoList(infoList))

      const tempList = await getAssetsFile()
      if (tempList.length) {
        dispatch($token.set.list(tempList))
      }

      setIsList(true)
    })()
  }, [])

  useEffect(() => {
    if (router.isReady) {
      if (queryBlockchainCode) {
        if ( ! pageBlockchains.map(item => item.code).includes(queryBlockchainCode)) {
          dispatch($app.set.code('ethereum'))
        } else {
          if (queryBlockchainCode != blockchain.code) {
            dispatch($app.set.code(queryBlockchainCode))
          }
        }
      }

      setIsBlockchain(true)
    }
  }, [router.isReady, queryBlockchainCode])

  useEffect(() => {
    if (router.isReady && isList && isBlockchain) {
      setIsReady(true)
    }
  }, [router.isReady, isList, isBlockchain])

  useEffect(() => {
    if (blockchain.code != blockchainCode.current) {
      blockchainCode.current = blockchain.code
      apollo.current = getApolloClient(blockchain)
      dispatch($token.set.current({}))
      dispatch($token.set.fetching(true))
      dispatch($collection.set.all([]))
      dispatch($collection.set.current({}))
    }
  }, [blockchain.code])

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

    const result = await apollo.current.query({
      query: $token.query.tokens,
      variables: {
        skip: searchText != '' ? 0 : (page - 1) * 10,
        orderBy,
        orderDirection,
        searchText,
        usdt: blockchain.usdtContract.toLowerCase(),
      },
    })

    if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('tokens')) {
      let tempTokens = result.data.tokens
      if (!tempTokens.length && searchText != '' && isContractAddress(searchText)) {
        const scanData = await getBasicInfo(searchText, blockchain.id)
        if (scanData) {
          tempTokens = [{
            ...scanData,
            id: scanData.address,
            totalSupply: scanData.totalSupply.formatted,
          }]
        }
      }

      const info = await getInfo(tempTokens)

      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))

      const tempAll = tempTokens.map(item => {
        return {
          basic: item,
          blockchain: blockchain.code,
          info: info.find(el => el.address.toLowerCase() == item.id.toLowerCase()),
        }
      })

      if (current?.id && pages.current == 1 && search == '') {
        if (!tempAll.some(item => item.basic.id.toLowerCase() == current.id.toLowerCase())) {
          tempAll.unshift(current)
        }
      }

      if (searchText == '') {
        dispatch($token.set.searched([]))
        dispatch($token.set.all(tempAll))
        dispatch($token.set.searchEmpty(false))
      } else {
        dispatch($token.set.searched(tempAll))
        dispatch($token.set.searching(true))
        dispatch($token.set.searchEmpty(!tempAll.length))
      }

      if (! current?.id) {
        const [first] = tempTokens
        router.replace(`/tokens/${blockchain.code}/${first.id}`, undefined, { scroll: false })
      }
    }

    dispatch($token.set.loading(false))
  }

  const getInfo = async (tokens) => {
    const platform = blockchain.platform
    const addresses = tokens.map(item => item.id.toLowerCase())

    const idToAddressList = addresses.map(address => {
      const foundItem = infoList.find(item => {
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
        const temp = window.location.pathname.split('/')
        if (temp.length == 4) {
          tempTokenId = temp.pop().replace(/^\/|\/$/g, '') || null
        }

        const realTokenId = queryTokenId ?? tempTokenId
        if ( ! realTokenId && tokens.length) {
          let id = current?.id
          if ( ! id) {
            const [first] = tokens
            id = first.id
          }
          router.replace(`/tokens/${blockchain.code}/${id}`, undefined, { scroll: false })
          return
        }

        if (realTokenId) {
          const currentToken = await getToken(realTokenId)
          dispatch($token.set.current(currentToken))
          dispatch($token.set.update(currentToken))

          if (tokens.length && pages.current == 1 && search == '') {
            if (!tokens.some(item => item.id == currentToken.id)) {
              tokens.unshift(currentToken)
            }
          }

          const existingToken = list.length ? list.find(item => item.id === currentToken.id) : null

          if (! existingToken) {
            const fullToken = await getTokenFull(currentToken)
            dispatch($token.set.current(fullToken))
            dispatch($token.set.update(fullToken))

            const staticData = staticTemplate(fullToken)
            const preUpdateList = list.filter(item => item.address !== currentToken.address)
            const mergedData = preUpdateList.length ? [...preUpdateList, staticData] : [staticData]
            putAssetsFile(mergedData)
            dispatch($token.set.list(mergedData))
          } else {
            let mergedData = {}
            const tokenPrices = tokens.find(item => item.address === existingToken.address)
            
            if (tokenPrices) {
              mergedData = {...existingToken, ...tokenPrices}
            } else {
              const [priceInfo] = await getInfo([existingToken])
              const priceTemplate = template({info: priceInfo})
              mergedData = {...existingToken, ...priceTemplate}

            }
            dispatch($token.set.current(mergedData))
            dispatch($token.set.update(mergedData))
          }
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
      const result = await apollo.current.query({
        query: $token.query.token,
        variables: {
          id,
        },
      })

      if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('token') && result.data.token != null) {
        token = {
          basic: result.data.token,
          blockchain: blockchain.code,
        }
      } else {
        const scanData = await getBasicInfo(id, blockchain.id)
        if (scanData) {
          token = {
            basic: {
              ...scanData,
              id: scanData.address,
              totalSupply: scanData.totalSupply.formatted,
            },
            blockchain: blockchain.code,
          }
        } else {
          console.log('Token was not found in current blockchain')
        }
      }
    }

    return template(token ?? {})
  }

  const getTokenFull = async (token) => {
    let fullToken = {...token}

    if (token?.id && ! token.isFull) {
      const address = token.id.toLowerCase()
      const full = await $token.api.coingecko.full({ platform: blockchain.platform, address })
      fullToken.full = full
    }

    return template(fullToken)
  }

  useEffect(() => {
    if (sort != sortRef.current) {
      sortRef.current = sort
      dispatch($token.set.fetching(true))
    }
  }, [sort])

  useEffect(() => {
    if (search != searchRef.current) {
      searchRef.current = search
      if (search != '') {
        dispatch($token.set.fetching(true))
      } else {
        dispatch($token.set.searching(false))
        dispatch($token.set.searchEmpty(false))
      }
    }
  }, [search])

  useEffect(() => {
    if (pages.current != pageRef.current) {
      pageRef.current = pages.current
      dispatch($token.set.fetching(true))
    }
  }, [pages])

  return children
}

export default WrapperTokens