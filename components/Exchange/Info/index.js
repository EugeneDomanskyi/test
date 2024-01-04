import { memo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $token from '@/store/token'
import App from '@/components/App'

import styles from './styles.module.scss'

const Info = () => {
  const router = useRouter()
  const [urlAddress] = router.query.address || []
  const address = urlAddress ? urlAddress?.toLowerCase() : ''
  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(address)
  const urlBlockchain = router.query.blockchain

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({ $token }) => $token.current)
  const list = useSelector(({ $token }) => $token.all)
  const loading = useSelector(({ $token }) => $token.loading)
  const sort = useSelector(({ $token }) => $token.sort)
  const prefill = useSelector(({ $portfolio }) => $portfolio.prefill)

  const [sortBy, sortDirection] = sort.split(':')

  const scanLink = `${blockchain.scanUrl}/address/${current.id}`
  const websiteLink = `https://tegro.com/${blockchain.code}/${current.id}`

  useEffect(() => {
    if (!isAddress && blockchain.code === urlBlockchain && list.length && !isMobile && !loading) {
      dispatch($token.set.current(list[0]))
      router.replace(`/exchange/${urlBlockchain}/${list[0].id}`)
    }
  }, [isAddress, list, urlBlockchain, blockchain.code, isMobile, loading])

  useEffect(() => {
    if (isAddress && blockchain.code === urlBlockchain && (!current?.id || prefill.address)) {
      fetchToken(prefill.address ?? address)
    }
  }, [isAddress, urlBlockchain, blockchain.code, address, current?.id, prefill.address])

  const fetchToken = async (currentAddress) => {
    const existInList = list.find(item => item.id === currentAddress)
    if (!existInList) {
      const [token] = await $token.api.backend.all({
        page: 1,
        page_size: 1,
        chain_id: blockchain.id,
        sort_by: sortBy,
        sort_order: sortDirection,
        filter_val: currentAddress,
        filter_col: 'contract_address',
        verified: true,
      })

      if (token) {
        dispatch($token.set.current(token))
      }
    } else {
      dispatch($token.set.current(existInList))
    }
  }

  const handleClickLink = (type) => () => {
    if (type == 'market-page') {
      trackEvent(`Page Visited`, {
        'Page Name': 'Market Page',
        'Market': current.marketId,
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
                <img src={current?.image} width={36} height={36} alt="" />
              ) : (
                <div className={styles.emptyImage} />
              )}

              <App.Flex column gap={4}>
                <App.Flex row align="center" gap={8}>
                  <App.Text size={16} weight={600} uppercase height={1}>{ current?.name}</App.Text>
                  {/* <a href={websiteLink} style={{ lineHeight: 0 }} target="_blank" rel="noreferrer">
                    <App.Text size={12} color={websiteLink ? '#4C69FF' : '#B9B8C5'} nowrap height={1} onClick={handleClickLink('market-page')}><App.Icon icon="external-link" /></App.Text>
                  </a> */}
                </App.Flex>

                {current?.id ? (
                  <App.Flex row align="center" gap={4}>
                    <Image src={`/images/icon-${blockchain.code}.png`} width={12} height={12} alt="" />
                    <App.Text inline size={12} weight={600} color="#B9B8C5" nowrap height={1}>{ blockchain?.name }:</App.Text>
                    <a href={scanLink} target="_blank" rel="noreferrer" style={{ lineHeight: 0 }}>
                      <App.Text inline size={12} weight={600} color="#B9B8C5" nowrap height={1} onClick={handleClickLink(blockchain?.code)} sx={{ cursor: 'pointer' }}>{[current.id.slice(0, 7), current.id.slice(-7)].join('...')}</App.Text>
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
              <App.Number size={12} height={1} color="#B9B8C5">${ current?.price }</App.Number>
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
              <App.Number size={12} weight={600} height={1} color="#fff">{ current.high }</App.Number>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Text nowrap size={12} height={1} color="#B9B8C5">24h Low</App.Text>
              <App.Number size={12} weight={600} height={1} color="#fff">{ current.low }</App.Number>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Text nowrap size={12} height={1} color="#B9B8C5">24h Volume (USDT)</App.Text>
              <App.Number size={12} weight={600} height={1} color="#fff">{ current.volume }</App.Number>
            </App.Flex>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

const isEqual = () => {
  return true
}

export default memo(Info, isEqual)
