import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import useWalletConnect from './wallet-connect'

const useOrders = ({collectionId}) => {
  const dispatch = useDispatch()

  

  const blockchain = useSelector($app.get.blockchain)
  const { wallet } = useWalletConnect()

  console.log('collectionId', collectionId, blockchain.code)

  const updateOrders = () => {
    if (wallet) {
      $exchange.api.get.orders({
        blockchain: blockchain.code,
        maker: wallet,
        includeCriteriaMetadata: true,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orders(res))
        }
      })
    }
    
    $exchange.api.get.orderBook({
      collection: collectionId,
      blockchain: blockchain.code,
    }).then(res => {
      dispatch($exchange.set.orderBook(res))
    })
  }

  return {
    updateOrders: updateOrders,
  }
}

export default useOrders
