import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { connect } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'

import useWalletConnect from '@/myhooks/wallet-connect'
import { CHAINS } from '@/config'

import $app from '@/store/app'

export const useApp = () => {
  const { wallet, disconnect } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const devMode = useSelector(({ $app }) => $app.devMode)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const initWallet = useSelector(({ $app }) => $app.initWallet)

  const [appWallet, setAppWallet] = useState(initWallet)

  useEffect(() => {
    window.appDataHandler = appDataHandler
  }, [])

  const appDataHandler = (data) => {
    if (isApp && data) {
      if (data.hasOwnProperty('devMode')) {
        appLog(`devMode ${data.devMode}`)
        dispatch($app.set.devMode(data.devMode))
      }

      if (data?.walletAddress && data.walletAddress.toLowerCase() != wallet) {
        setAppWallet(data.walletAddress.toLowerCase())
      }
    }
  }

  const appPost = (data) => {
    if (isApp) {
      window.ReactNativeWebView.postMessage(JSON.stringify(data))
    }
  }

  const appLog = (data) => {
    appPost({ log: data })
  }

  const appConnect = async (onComplete) => {
    let needConnect = !wallet
    if (wallet && wallet != appWallet) {
      appLog(`Disconnect ${wallet}`)
      await disconnect()
      return
    }

    if (needConnect) {
      const customConnector = new WalletConnectConnector({
        chains: CHAINS,
        options: {
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
          showQrModal: false,
          metadata: {
            name: 'TegroWebView',
            description: 'Tegro Wallet Dapp',
            url: 'tegro.com',
            icons: ['https://tegro.com/images/tegro-connect-wallet.png']
          }
        },
      })

      appLog(`Created Connector`)

      customConnector.on('message', ({type, data}) => {
        if (type == 'display_uri') {
          appPost({ wcUri: data})
          appLog(`Post URI`)
        }
      })

      const connected = await connect({
        connector: customConnector,
        chainId: blockchain.id,
      })

      setAppWallet(connected.account.toLowerCase())
      appLog(`Connected to wallet ${connected.account}`)
    } else {
      appLog(`Do not need to Connect: ${wallet}`)
    }

    if (onComplete) {
      onComplete()
    }
  }

  return { isApp, appWallet, appConnect, appPost, appLog }
}

export default useApp