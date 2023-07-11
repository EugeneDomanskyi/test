import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import $modal from '@/store/modal'

import App from '@/components/App'
import HomeBalance from '@/components/HomeBalance'

import styles from './styles.module.scss'

const Header = () => {
  const { wallet, connect, disconnect } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()

  const [menuShow, setMenuShow] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#wallet')) {
      setMenuShow(false)
    }
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      trackEvent('Dex Wallet Connect Clicked')
      const result = await connect()
      if (result) {
        trackEvent('Dex Wallet Connected Successfully')
      }
    }
  }

  const shorterAddress = () => {
    return wallet ? (wallet.slice(0, 6) + '...' + wallet.slice(wallet.length - 6)) : ''
  }

  const handleMenuToggle = () => {
    if (isMobile) {
      dispatch($modal.set.show({modal: 'HomeDisconnectModal', props: {
        header: {
          content: (
            <App.Button primary large outlined rounded sx={{ width: 175 }}>
              <App.Flex row gap={8} align="center">
                <App.Flex width={28} height={28} sx={{ borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} />
                <span>{shorterAddress()}</span>
              </App.Flex>
            </App.Button>
          ),
        },
      }}))
    } else {
      setMenuShow( ! menuShow)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setMenuShow(false)
  }

  return (
    <div className={styles.container}>
      <App.Container height="100%">
        <App.Flex row height="100%" align="center" justify="space-between">
          <App.Flex row gap={8} align="center">
            <App.Flex center width={32} height={32} sx={{ borderRadius: '50%', background: '#C8FD7C' }}>
              <App.Icon icon="logo" />
            </App.Flex>

            <App.Text size={16} weight={700}>nft-20.org</App.Text>
          </App.Flex>

          <App.Flex row gap={24} align="center">
            { ! isMobile ? <HomeBalance /> : null}

            {wallet ? (
              <App.Flex sx={{ position: 'relative' }} id="wallet">
                <App.Button primary large outlined rounded onClick={handleMenuToggle} sx={{ minWidth: 'auto' }}>
                  <App.Flex row gap={8} align="center">
                    <App.Flex width={28} height={28} sx={{ borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} />
                    {isMobile ? (
                      <App.Icon icon="caret-down" />
                    ) : (
                      <span>{shorterAddress()}</span>
                    )}
                  </App.Flex>
                </App.Button>

                <div className={cn(styles.menu, {[styles.active]: menuShow})}>
                  <App.Button primary fullWidth onClick={handleDisconnect}>
                  <App.Icon icon="logout" /> Disconnect
                  </App.Button>
                </div>
              </App.Flex>
            ) : (
              <App.Button primary large onClick={handleConnectWallet}>
                Connect Wallet
              </App.Button>
            )}
          </App.Flex>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default Header