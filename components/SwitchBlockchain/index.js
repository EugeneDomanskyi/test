import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwitchBlockchain = ({ justify = 'center', onMobileMenuClose }) => {
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { blockchains } = useSelector(({ $app }) => $app)

  const [menuShow, setMenuShow] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#blockchain')) {
      setMenuShow(false)
    }
  }

  const handleMenuToggle = () => {
    setMenuShow( ! menuShow)
  }

  const handleBlockchainChange = (val) => () => {
    trackEvent('Switch Network', {
      Network: val.toUpperCase(),
    })
    
    dispatch($app.set.code(val))
    dispatch($collection.set.pagesClear())
    setMenuShow(false)

    if (onMobileMenuClose) {
      onMobileMenuClose()
    }
  }

  return (
    <App.Flex row align="center" justify={justify} gap={8} sx={{ position: 'relative' }} id="blockchain">
      <App.Flex row center gap={8} className={styles.badge} sx={{ cursor: 'pointer' }} onClick={handleMenuToggle}>
        <Image src={`/images/icon-${blockchain.code}.png`} width={28} height={28} alt="" />
        <App.Text size={16} weight={700}>{blockchain.name}</App.Text>
        <App.Icon icon="caret-down" />
      </App.Flex>

      <div className={cn(styles.menu, {[styles.active]: menuShow})}>
        <App.Flex column>
          {blockchains.map(item => (
            <App.Flex row gap={8} key={item.id} align="center" className={styles.item} onClick={handleBlockchainChange(item.code)}>
              <Image src={`/images/icon-${item.code}.png`} width={28} height={28} alt="" />
              <App.Text nowrap size={16} weight={700} height={1}>{ item.name }</App.Text>
            </App.Flex>
          ))}
        </App.Flex>
      </div>
    </App.Flex>
  )
}

export default SwitchBlockchain