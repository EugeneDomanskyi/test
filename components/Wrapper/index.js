import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import Stream from '@/libs/stream.lib'

import $app from '@/store/app'
import $collection, { template } from '@/store/collection'
import $token, { template as tokenTemplate } from '@/store/token'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const router = useRouter()
  const [collectionId] = router.query.collectionId || []
  const [tokenId] = router.query.tokenId || []
  const isExchange = router.pathname.includes('/exchange')
  const isTokens = router.pathname.includes('/tokens')

  const { usdt, network } = useWalletConnect()
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { blockchains } = useSelector(({ $app }) => $app)
  const { fetching: collectionFetching, page, current: collection } = useSelector(({ $collection }) => $collection)
  const { fetching: tokenFetching, current: token, page: tokenPage, prepared, ids } = useSelector(({ $token }) => $token)
  const { collections, searched } = useSelector($collection.get.all)
  const client = useSelector($token.get.client)
  const query = useSelector($token.get.query)
  const { tokens, searched: searchedTokens } = useSelector($token.get.all)
  const tokenIds = useSelector($token.get.ids)

  const blockchainCode = useRef(blockchain.code)

  useEffect(() => {
    (async () => {
      const deviceId = localStorage.getItem('device_id')
      if (!deviceId) {
        localStorage.setItem('device_id', uuid())
      }

      loadIntercom({
        user_id: deviceId,
        appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
        ssr: false,
        initWindow: false,
        delay: 0,
      })

      trackEvent('Page Visited')

      const result = await $token.api.tokens.all()
      if (result) {
        dispatch($token.set.prepared(result))
      }

      const ids = await $token.api.tokens.ids({ include_platform: true })
      if (ids) {
        dispatch($token.set.ids(ids))
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      if (router.isReady) {
        if (! isExchange || isExchange && collectionFetching) {
          dispatch($collection.set.loading(true))

          const result = await $collection.api.all(queryParams(blockchainCode.current, page, {minFloorAskPrice: '0.000001', maxFloorAskPrice: process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null }))
          if (result && result.hasOwnProperty('collections')) {
            dispatch($collection.set.searched([]))
            dispatch($collection.set.all(result.collections.map(item => {
              return {
                ...item,
                blockchain: blockchainCode.current,
                currency: network(blockchainCode.current)?.currency,
              }
            })))
            dispatch($collection.set.pages(result?.continuation))

            if (isExchange && ! collection?.address) {
              const [first] = result.collections
              router.replace(first.id, undefined, { scroll: false })
            }
          }

          dispatch($collection.set.loading(false))
          dispatch($collection.set.fetching(false))
          initWSConnection(blockchainCode.current)
          // Stream.subscribe('collection.updated', result.collections.map(c => c.id))
          // Stream.on('collection.updated', (data) => {
          //   console.log('collection.updated', data)
          // })
        }
      }
    })()
  }, [collectionFetching, router.isReady])

  useEffect(() => {
    (async () => {
      if (router.isReady && prepared.length && ids.length) {
        if (isTokens && tokenFetching) {
          dispatch($token.set.loading(true))

          const result = await client.query({
            query: query.tokens,
            variables: {
              skip: (tokenPage - 1) * 10,
              orderBy: 'volumeUSD',
              orderDirection: 'desc',
              searchText: '',
            },
          })

          if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('tokens')) {
            const currentIds = result.data.tokens.map(item => item.id.toLowerCase())
            const cgIds = tokenIds(currentIds, network(blockchainCode.current)?.platform)
            let infos = []
            if (cgIds.length) {
              infos = await $token.api.tokens.info({ vs_currency: 'usd', ids: cgIds.join(',') })
            }

            dispatch($token.set.searched([]))
            dispatch($token.set.all(result.data.tokens.map(item => {
              const preparedToken = prepared.find(el => el.address.toLowerCase() == item.id.toLowerCase())
              const info = infos.find(el => el.symbol.toLowerCase() == item.symbol.toLowerCase())

              return {
                ...item,
                blockchain: blockchainCode.current,
                currency: network(blockchainCode.current)?.currency,
                prepared: preparedToken,
                info,
              }
            })))
            dispatch($token.set.pages(tokenPage * 1 + 1))

            if (isTokens && ! token?.id) {
              const [first] = result.data.tokens
              router.replace(first.id, undefined, { scroll: false })
            }
          }

          dispatch($token.set.loading(false))
          dispatch($token.set.fetching(false))
        }
      }
    })()
  }, [tokenFetching, prepared, ids, router.isReady])

  useEffect(() => {
    (async () => {
      if (isExchange) {
        let tempCollectionId = null
        const temp = window.location.pathname.split('exchange')
        if (temp.length > 1) {
          tempCollectionId = temp[1].replace(/^\/|\/$/g, '') || null
        }
        
        const currentBlockchainCode = blockchainCode.current
        const realCollectionId = collectionId ?? tempCollectionId

        if ( ! realCollectionId && ! collection?.address && collections.length) {
          const [first] = collections
          router.replace(first.address, undefined, { scroll: false })
          return
        }

        if (realCollectionId) {
          const currentCollection = await getCollection(realCollectionId)
          dispatch($collection.set.current(currentCollection))
        }

        if ( ! collections.length && currentBlockchainCode == blockchainCode.current) {
          dispatch($collection.set.fetching(true))
        }
      }
    })()
  }, [collectionId, isExchange])

  useEffect(() => {
    (async () => {
      if (isTokens && ids.length) {
        let tempTokenId = null
        const temp = window.location.pathname.split('tokens')
        if (temp.length > 1) {
          tempTokenId = temp[1].replace(/^\/|\/$/g, '') || null
        }
        
        const realTokenId = tokenId ?? tempTokenId
        if ( ! realTokenId && ! token?.id && tokens.length) {
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
  }, [tokenId, ids, isTokens])

  useEffect(() => {
    if (blockchain.code != blockchainCode.current) {
      blockchainCode.current = blockchain.code
      dispatch($collection.set.fetching(true))
      dispatch($token.set.fetching(true))
    }
  }, [blockchain.code])

  const getCollection = async (address) => {
    let collection = collections.find(item => item.address == address)
    if ( ! collection) {
      collection = searched.find(item => item.address == address)
    }

    if ( ! collection) {
      const result = await $collection.api.all(queryParams(blockchainCode.current, page, { id: address, limit: 1 }))
      if (result && result.hasOwnProperty('collections')) {
        if (result.collections.length) {
          const [current] = result.collections
          current.blockchain = blockchainCode.current
          current.currency = network(blockchainCode.current)?.currency
          collection = template(current)
        } else {
          let collectionWasFound = false
          for (const chain of blockchains) {
            if ( ! collectionWasFound && chain.code != blockchainCode.current) {
              const result = await $collection.api.all(queryParams(chain.code, page, { id: address, limit: 1 }))

              if (result && result.hasOwnProperty('collections') && result.collections.length) {
                const [current] = result.collections
                collectionWasFound = true
                blockchainCode.current = chain.code
                current.currency = network(chain.code)?.currency
                dispatch($app.set.code(chain.code))
                current.blockchain = chain.code
                collection = template(current)
              }
            }
          }
        }
      }
    }

    return collection ?? {}
  }

  const queryParams = (blockchainCode, page, customParams) => {
    const defaultParams = {
      blockchain: blockchainCode,
      sortBy: '1DayVolume',
      limit: 10,
      // minFloorAskPrice: '0.000001',
      // displayCurrency: usdt[blockchainCode],
      // id: '0x4d544035500d7ac1b42329c70eb58e77f8249f0f',
    }

    let continuation = null
    if (page != 'init') {
      continuation = page
    }

    return {
      ...defaultParams,
      ...customParams,
      continuation,
    }
  }

  const getToken = async (id) => {
    let token = tokens.find(item => item.id == id)
    if ( ! token) {
      token = searchedTokens.find(item => item.id == id)
    }

    if ( ! token) {
      const result = await client.query({
        query: query.token,
        variables: {
          id,
        },
      })

      if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('token')) {
        const preparedToken = prepared.find(el => el.address.toLowerCase() == result.data.token.id.toLowerCase())

        token = {
          ...result.data.token,
          prepared: preparedToken,
          blockchain: blockchainCode.current,
        }
      }
    }

    if (token && ! token.isFull) {
      const full = await $token.api.tokens.full({ platform: network(blockchainCode.current)?.platform, address: token.id.toLowerCase() })
      token = {
        ...token,
        full,
      }
    }

    return tokenTemplate(token ?? {})
  }

  const initWSConnection = async (blockchain) => {
    dispatch($app.set.socketConnected(false))
    await Stream.connect(blockchain)
    dispatch($app.set.socketConnected(true))
  }

  return (
    <>
      <Header />
      {children}

      {!isExchange ? (
        <Footer />
      ) : null}
    </>
  )
}

export default Wrapper