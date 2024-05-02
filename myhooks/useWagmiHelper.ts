import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import $app from '@/store/app'

import WagmiHelper from '@/libs/WagmiHelper'
import { useDispatch, useSelector } from 'react-redux'

const useWagmiHelper = () => {
  const { address, isConnected } = useAccount()
  const { openConnectModal, connectModalOpen } = useConnectModal()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const wpk = useSelector(({ $app }) => $app.wpk)
  const connection = useSelector(({ $app }) => $app.connection)
  const wallet = useSelector(({ $app }) => $app.wallet)
  const appConnected = useSelector(({ $app }) => $app.appConnected)

  useEffect(() => {
    if (!isApp) {
      const unwatch = WagmiHelper.watchConnection((result: { loading: boolean, connected: boolean }) => {
        if (result.loading != connection.loading || result.connected != connection.connected) {
          dispatch($app.set.connection(result))
        }
      })
      
      return unwatch
    }
  }, [isApp])

  useEffect(() => {
    if (isApp && wpk && !appConnected) {
      const connected = WagmiHelper.createAppWallet(wpk, blockchain)
      dispatch($app.set.connection({ loading: false, connected }))
      dispatch($app.set.appConnected(connected))
    }
  }, [isApp, wpk, appConnected])

  useEffect(() => {
    if (connectModalOpen && isConnected) {
      WagmiHelper.connectSuccess()
    }
  }, [connectModalOpen, isConnected])

  useEffect(() => {
    if (isApp) {
      if (appConnected) {
        const wallet = WagmiHelper.getWallet()
        if (!wallet) {
          dispatch($app.set.appConnected(false))
          return
        }
        dispatch($app.set.wallet(WagmiHelper.getWallet()))
      }
    } else {
      if (isConnected) {
        if (wallet != address.toLowerCase()) {
          dispatch($app.set.wallet(address.toLowerCase()))
        }
      } else {
        dispatch($app.set.wallet(null))
      }
    }
  }, [address, isConnected, isApp, appConnected])

  const connect = () => {
    return new Promise((resolve, reject) => {
      const wallet = WagmiHelper.getWallet()
      if (wallet) {
        resolve(wallet)
        return
      }

      if (openConnectModal) {
        openConnectModal()
      }

      WagmiHelper.setConnectCallbacks(resolve, reject)
    })
  }

  return {
    wallet,
    connection,
    connect,
  }
}

export default useWagmiHelper