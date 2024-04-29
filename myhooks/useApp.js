import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createConfig, http, connect } from '@wagmi/core'
import { walletConnect } from '@wagmi/connectors'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'

const useApp = () => {
  const { wallet, disconnect } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const platform = useSelector(({ $app }) => $app.platform)
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
        appConnect(null, data.walletAddress.toLowerCase())
      }

      if (data?.walletTheme) {
        dispatch($app.set.appTheme(data.walletTheme))
      }

      if (data?.clearLocalStorage) {
        appLog(`Clear Local Storage`)
        window.localStorage.clear()
      }
    }
  }

  const appPost = (data) => {
    if (isApp) {
      if (data?.clear) {
        window.localStorage.clear()
      }
      window.ReactNativeWebView.postMessage(JSON.stringify(data))
    }
  }

  const appLog = (data) => {
    appPost({ log: data })
  }

  const appConnect = async (onComplete, currentWallet = appWallet) => {
    let needConnect = !wallet
    appLog(`${wallet} --- ${currentWallet}`)
    if (wallet && wallet != currentWallet) {
      appLog(`Disconnect ${wallet}`)
      await disconnect()
      return
    }

    if (needConnect) {
      const customConnector = walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        showQrModal: false,
        metadata: {
          name: 'TegroWebView',
          description: 'Tegro Wallet Dapp',
          url: 'tegro.com',
          icons: ['https://tegro.com/images/tegro-connect-wallet.png']
        },
      })

      appLog(`Created Config`)

      const newConfig = null
      
      // customConnector().getProvider().on('message', ({type, data}) => {
      //   if (type == 'display_uri') {
      //     appPost({ wcUri: data})
      //     appLog(`Post URI`)
      //   }
      // })

      const connected = await connect(newConfig, {
        connector: customConnector,
        chainId: blockchain.id,
      }).catch(e => {
        appLog(e)
        disconnect()
      })

      if (!connected) {
        return
      }

      setAppWallet(connected.accounts[0].toLowerCase())
      appLog(`Connected to wallet ${connected.accounts[0]}`)
    } else {
      appLog(`Do not need to Connect: ${wallet}`)
    }

    if (onComplete) {
      onComplete()
    }
  }
  
  return { isApp, appWallet, platform, appConnect, appPost, appLog }
}

export default useApp