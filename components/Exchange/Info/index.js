import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import { fetchPrices, getTokens } from '@/api_services/tokens'

import $app from '@/store/app'
import $exchange from '@/store/exchange'
import $token from '@/store/token'
import $collection from '@/store/collection'

import coingeckoAssets from '@/public/files/coingecko_ids'
import App from '@/components/App'

import styles from './styles.module.scss'

const Info = ({ type }) => {
  const router = useRouter()
  const [urlAddress] = router.query.address || []
  const address = urlAddress ? urlAddress?.toLowerCase() : ''
  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(address)
  const urlBlockchain = router.query.blockchain

  const { getPrice } = useWalletConnect()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.current : $collection.current)
  const list = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.all : $collection.all)
  const loading = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.loading : $collection.loading)
  const { high, low } = useSelector($exchange.get.highLow({ count: 24, unit: 'hours' }))

  const [usdPrice, setUsdPrice] = useState(current.price)

  const scanLink = `${blockchain.scanUrl}/address/${current.address}`
  const websiteLink = `https://tegro.com/${blockchain.code}/${current.address}`

  useEffect(() => {
    if (!isAddress && blockchain.code === urlBlockchain && list.length && !isMobile && !loading) {
      if (type == 'tokens') {
        dispatch($token.set.current(list[0]))
        router.replace(`/exchange/${urlBlockchain}/${list[0].id}`)
      } else {
        dispatch($collection.set.current(list[0]))
        router.replace(`/nfts/${urlBlockchain}/${list[0].id}`)
      }
    }
  }, [isAddress, list, urlBlockchain, blockchain.code, isMobile, loading])

  useEffect(() => {
    if (isAddress && blockchain.code === urlBlockchain && !current?.id) {
      if (type == 'tokens') {
        fetchToken()
      } else {
        // Fetch collection
      }
    }
  }, [isAddress, urlBlockchain, blockchain.code, address, current?.id])

  const fetchToken = async () => {
    const existInList = list.find(item => item.id === address)
    if (!existInList) {
      const post = {
        currentPage: 1,
        perPage: 1,
        orderBy: 'name',
        orderDirection: 'asc',
        searchText: address,
        searchField: 'contract_address',
      }

      const [token] = await getTokens(blockchain, post)
      if (token) {
        let currentToken = {
          ...token,
        }

        const prices = await fetchPrices(blockchain, [token])
        if (prices[token.id]) {
          currentToken = {
            ...currentToken,
            ...prices[token.id],
          }
        }

        dispatch($token.set.current(currentToken))
      }
    } else {
      dispatch($token.set.current(existInList))
    }
  }

  useEffect(() => {
    if (current.id) {
      fetchUsdPrice()
    }
  }, [current.id])
  
  const fetchUsdPrice = async () => {
    const cgid = coingeckoAssets[blockchain.platform]?.[current.id]
    if (cgid) {
      const price = await getPrice(cgid, 'usd')
      if (price) {
        setUsdPrice(price)
        return
      }
    }

    setUsdPrice(current.price)
  }

  const handleClickLink = (type) => () => {
    if (type == 'market-page') {
      trackEvent(`Page Visited`, {
        'Page Name': 'Market Page',
        'Market': `${ current?.symbol ?? current?.slug }${type == 'tokens' ? '/USDT' : ''} (${current.name})`,
        'Network': blockchain.name,
      })
    } else {
      trackEvent(`Click ${type} Redirect`, {
        Markets: current.name,
      })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(current.address)
  }
  
  return (
    <App.Flex row align="center" className={styles.container}>
      {current ? (
        <>
          <App.Flex row align="center" className={styles.gap}>
            <App.Flex row center gap={8}>
              {current?.image ? (
                <Image src={current?.image} width={36} height={36} alt="" />
              ) : (
                <div className={styles.emptyImage} />
              )}

              <App.Flex column gap={4}>
                <App.Flex row align="center" gap={8}>
                  <App.Text size={16} weight={600} uppercase height={1}>{ current?.symbol ?? current?.slug }{type == 'tokens' ? '/USDT' : ''}</App.Text>
                  <a href={websiteLink} style={{ lineHeight: 0 }} target="_blank" rel="noreferrer">
                    <App.Text size={12} color={websiteLink ? '#4C69FF' : '#B9B8C5'} nowrap height={1} onClick={handleClickLink('market-page')}>{ current?.name } <App.Icon icon="external-link" /></App.Text>
                  </a>
                </App.Flex>

                {current?.address ? (
                  <App.Flex row align="center" gap={4}>
                    <Image src={`/images/icon-${blockchain.code}.png`} width={12} height={12} alt="" />
                    <App.Text inline size={12} weight={600} color="#B9B8C5" nowrap height={1}>{ blockchain?.name }:</App.Text>
                    <a href={scanLink} target="_blank" rel="noreferrer" style={{ lineHeight: 0 }}>
                      <App.Text inline size={12} weight={600} color="#B9B8C5" nowrap height={1} onClick={handleClickLink(blockchain?.code)} sx={{ cursor: 'pointer' }}>{[current.address.slice(0, 7), current.address.slice(-7)].join('...')}</App.Text>
                    </a>

                    <App.Flex center sx={{ cursor: 'pointer' }} onClick={handleCopy}>
                      <App.Icon icon="copy2" color="#B9B8C5" />
                    </App.Flex>
                  </App.Flex>
                ) : null}
              </App.Flex>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Number size={16} weight={600} height={1} color="#53F19C">{ current?.price }</App.Number>
              <App.Number size={12} height={1} color="#B9B8C5">${ usdPrice }</App.Number>
            </App.Flex>
          </App.Flex>

          <div className={styles.line} />
          
          <App.Flex row align="center" className={styles.gap}>
            <App.Flex column gap={6}>
              <App.Text nowrap size={12} height={1} color="#B9B8C5">24h Change</App.Text>
              <App.Flex align="center" gap={4}>
                <App.Icon style={{transform: `rotate(${current?.ticker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={current?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' } width={10} height={10} />
                <App.Text size={12} weight={600} height={1} color={current?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' }>{ current?.ticker?.value }%</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Text nowrap size={12} height={1} color="#B9B8C5">24h High</App.Text>
              <App.Number size={12} weight={600} height={1} color="#fff">{ current?.high ?? high }</App.Number>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Text nowrap size={12} height={1} color="#B9B8C5">24h Low</App.Text>
              <App.Number size={12} weight={600} height={1} color="#fff">{ current?.low ?? low }</App.Number>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Text nowrap size={12} height={1} color="#B9B8C5">24h Volume (USDT)</App.Text>
              <App.Number size={12} weight={600} height={1} color="#fff">{ current?.volume }</App.Number>
            </App.Flex>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type
}

export default memo(Info, isEqual)
