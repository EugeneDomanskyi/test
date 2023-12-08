import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'
import { useNetwork } from 'wagmi'

import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $collection from '@/store/collection'
import $token from '@/store/token'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwitchBlockchain = ({ justify = 'center', onMobileMenuClose }) => {
  const { chain } = useNetwork()
  const { changeNetwork } = useWalletConnect()

  const router = useRouter()
  const [_, page] = router.asPath.split('/')
  const queryBlockchain = router.query.blockchain

  const dispatch = useDispatch()
  const isMobile = useSelector(({$app}) => $app.size.isMobile)
  const blockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector($app.get.pageBlockchains(page))

  const [menuShow, setMenuShow] = useState(false)
  const [queryBlockchainChecked, setQueryBlockchainChecked] = useState(false)

  const prevWalletChainId = useRef(chain?.id)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (queryBlockchain) {
        if (queryBlockchain != blockchain.code) {
          const newBlockchainCode = pageBlockchains.some(item => item.code == queryBlockchain) ? queryBlockchain : 'ethereum'
          if (newBlockchainCode != blockchain.code) {
            const newBlockchain = pageBlockchains.find(item => item.code == newBlockchainCode)
            if (chain?.id) {
              if (chain.id != newBlockchain.id) {
                const result = await changeNetwork(newBlockchainCode)
                if (result) {
                  dispatch($app.set.code(newBlockchain.code))
                  return
                }
              }
            }

            dispatch($app.set.code(newBlockchain.code))
          }
        } else {
          const newBlockchain = pageBlockchains.find(item => item.code == queryBlockchain)
          if (chain?.id) {
            if (chain.id != newBlockchain.id) {
              const result = await changeNetwork(queryBlockchain)
              if (result) {
                dispatch($app.set.code(queryBlockchain))
                return
              }
            }
          }
        }
        setQueryBlockchainChecked(true)
      }
    })()
  }, [queryBlockchain, page])

  useEffect(() => {
    (async () => {
      if (chain?.id && queryBlockchainChecked) {
        if (chain.id != blockchain.id) {
          const supportCode = pageBlockchains.find(item => item.id == chain.id)?.code
          if (supportCode && prevWalletChainId.current) {
            if (queryBlockchain && queryBlockchain != supportCode) {
              router.replace(`/${page}/${supportCode}/0x`)
            }

            dispatch($app.set.code(supportCode))

            if (page == 'exchange') {
              dispatch($token.set.loading(true))
              dispatch($token.set.clear())
            }
      
            if (page == 'nfts') {
              dispatch($collection.set.loading(true))
              dispatch($collection.set.clear())
            }
            prevWalletChainId.current = chain.id
          } else {
            await changeNetwork(blockchain.code)
            prevWalletChainId.current = blockchain.id
          }
        }
      }
    })()
  }, [chain?.id, queryBlockchainChecked, page])

  const handleBlockchainChange = async (val) => {
    if (val != blockchain.code) {
      trackEvent('Switch Network', {
        'Old Network': blockchain.code.toUpperCase(),
        'New Network': val.toUpperCase(),
      })

      const newBlockchain = pageBlockchains.find(item => item.code == val)
      if (chain?.id && chain.id != newBlockchain.id) {
        const result = await changeNetwork(newBlockchain.code)
        if (result) {
          dispatch($app.set.code(newBlockchain.code))
        }
      } else {
        if (queryBlockchain && queryBlockchain != newBlockchain.code) {
          router.replace(`/${page}/${newBlockchain.code}/0x`)
        }
        dispatch($app.set.code(newBlockchain.code))
      }

      if (page == 'exchange') {
        dispatch($token.set.loading(true))
        dispatch($token.set.clear())
      }

      if (page == 'nfts') {
        dispatch($collection.set.loading(true))
        dispatch($collection.set.clear())
      }
      setMenuShow(false)

      if (onMobileMenuClose) {
        onMobileMenuClose()
      }
    }
  }

  const handleClickOutside = (event) => {
    if (! event.target.closest('#blockchain')) {
      setMenuShow(false)
    }
  }

  const handleMenuToggle = () => {
    setMenuShow( ! menuShow)
  }

  return (
    <App.Flex row align="center" justify={justify} gap={8} sx={{ position: 'relative' }} id="blockchain" onMouseEnter={() => setMenuShow(true)} onMouseLeave={() => setMenuShow(false)}>
      <App.Flex row center gap={8} className={cn(styles.badge, {[styles.active]: menuShow})} sx={{ cursor: 'pointer' }} onClick={isMobile ? handleMenuToggle : null}>
      {/* <App.Flex row center gap={8} className={cn(styles.badge, {[styles.active]: menuShow})} sx={{ cursor: 'pointer' }}> */}
        <Image src={`/images/icon-${blockchain.code}.png`} width={28} height={28} alt="" />
        {
          ! isMobile
            ? <>
                <App.Text size={16} weight={700} className={styles.badgeTitle}>{blockchain.name}</App.Text>
                <App.Icon icon="caret-down" color="#fff" />
              </>
            : null
        }
      </App.Flex>

      <div className={cn(styles.menu, {[styles.active]: menuShow})}>
        <App.Flex column>
          {pageBlockchains.map(item => (
            <App.Flex key={item.id} row gap={16} align="center" justify="space-between" className={styles.item} onClick={() => handleBlockchainChange(item.code)}>
              <App.Flex row gap={8} align="center">
                <Image src={`/images/icon-${item.code}.png`} width={28} height={28} alt="" />
                <App.Text nowrap height={1}>{ item.name }</App.Text>
              </App.Flex>

              <App.Flex center width={20} height={20}>
                {item.code == blockchain.code ? (
                  <App.Icon icon="check" color="#53F19C" />
                ) : null}
              </App.Flex>
            </App.Flex>
          ))}
        </App.Flex>
      </div>
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return true
}

export default memo(SwitchBlockchain, isEqual)