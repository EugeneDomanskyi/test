import styles from './styles.module.scss'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'

const Info = ({ current, type }) => {
  const blockchain = useSelector($app.get.blockchain)
  const { high, low } = useSelector($exchange.get.highLow({count: 24, unit: 'hours'}))

  const scanLink = `${blockchain.scanUrl}/address/${current.address}`

  const handleClickLink = (type) => () => {
    trackEvent(`Click ${type} Redirect`, {
      Markets: current.name,
    })
    
    if (type == 'website') {
      if (current?.externalUrl) {
        window.open(current.externalUrl, '_blank')
      }
    } else {
      window.open(scanLink, '_blank')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(current.address)
  }

  return (
    <App.Flex row align="center" className={styles.container}>
      {current ? (
        <>
          <App.Flex row align="center" gap={40}>
            <App.Flex row center gap={8}>
              {current?.image ? (
                <Image src={current?.image} width={36} height={36} alt="" />
              ) : (
                <div className={styles.emptyImage} />
              )}

              <App.Flex column gap={4}>
                <App.Flex row align="center" gap={8}>
                  <App.Text size={16} weight={600} uppercase height={1}>{ current?.symbol ?? current?.slug }{type == 'tokens' ? '/USDT' : ''}</App.Text>
                  <App.Text size={12} color="#5E5C6B" nowrap sx={{ cursor: 'pointer' }} height={1} onClick={handleClickLink('website')}>{ current?.name } {current?.externalUrl ? <App.Icon icon="link" /> : null}</App.Text>
                </App.Flex>

                {current?.address ? (
                  <App.Flex row align="center" gap={4}>
                    <Image src={`/images/icon-${blockchain.code}.png`} width={12} height={12} alt="" />
                    <App.Text size={12} color="#5E5C6B" nowrap height={1} onClick={handleClickLink(blockchain?.code)} sx={{ cursor: 'pointer' }}>{ blockchain?.name }: {[current.address.slice(0, 7), current.address.slice(-7)].join('...')}</App.Text>
                    <App.Flex center sx={{ cursor: 'pointer' }} onClick={handleCopy}>
                      <App.Icon icon="copy2" />
                    </App.Flex>
                  </App.Flex>
                ) : null}
              </App.Flex>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Number size={16} weight={600} height={1} color="#53F19C">{ current?.price }</App.Number>
              <App.Number size={12} height={1} color="#5E5C6B">${ current?.price }</App.Number>
            </App.Flex>
          </App.Flex>

          <div className={styles.line} />
          
          <App.Flex row align="center" gap={40}>
            <App.Flex column gap={6}>
              <App.Number nowrap size={12} height={1} color="#5E5C6B">24h Change</App.Number>
              <App.Flex align="center" gap={4}>
                <App.Icon style={{transform: `rotate(${current?.ticker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={current?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' } width={10} height={10} />
                <App.Text size={12} height={1} color={current?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' }>{ current?.ticker?.value }%</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Number nowrap size={12} height={1} color="#5E5C6B">24h High</App.Number>
              <App.Number size={12} height={1} color="#B9B8C5">{ current?.high ?? high }</App.Number>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Number nowrap size={12} height={1} color="#5E5C6B">24h Low</App.Number>
              <App.Number size={12} height={1} color="#B9B8C5">{ current?.low ?? low }</App.Number>
            </App.Flex>

            <App.Flex column gap={6}>
              <App.Number nowrap size={12} height={1} color="#5E5C6B">24h Volume (USDT)</App.Number>
              <App.Number size={12} height={1} color="#B9B8C5">{ current?.tokenCount }</App.Number>
            </App.Flex>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.current === nextProps.current
    && prevProps.type === nextProps.type
}

export default memo(Info, isEqual)
