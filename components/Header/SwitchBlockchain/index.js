import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import WagmiHelper from '@/libs/WagmiHelper'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'
import $token from '@/store/token'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwitchBlockchain = ({ justify = 'center', onMobileMenuClose }) => {
  const router = useRouter()
  const [_, page] = router.asPath.split('/')
  const queryBlockchain = router.query.blockchain

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const blockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector(({ $app }) => $app.chains)

  const [menuShow, setMenuShow] = useState(false)

  const wagmiChainId = WagmiHelper.getConfigChainId()

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleBlockchainChange = async (val) => {
    if (val != blockchain.code) {
      const newBlockchain = pageBlockchains.find(item => item.code == val)
      if (wagmiChainId && wagmiChainId != newBlockchain.id) {
        const result = await WagmiHelper.changeChain(newBlockchain.code)
        if (result) {
          router.replace(`/${page}/${newBlockchain.code}/0x`)
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
        <Image src={`/images/icon-${blockchain.code}.png`} width={24} height={24} alt="" />
        {! isMobile ? <App.Text nowrap size={16} className={styles.badgeTitle}>{blockchain.name}</App.Text> : null}
      </App.Flex>

      <div className={cn(styles.menu, {[styles.active]: menuShow})}>
        <App.Flex column>
          {pageBlockchains.map(item => (
            <App.Flex key={item.id} row gap={16} align="center" justify="space-between" className={styles.item} onClick={() => handleBlockchainChange(item.code)}>
              <App.Flex row gap={8} align="center">
                <App.Flex row center className={styles.imageBox}>
                  <Image src={`/images/icon-${item.code}.png`} width={16} height={16} alt="" />
                </App.Flex>
                <App.Text nowrap size={12} height={1} color="#B9B8C5">{ item.name }</App.Text>
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