import { useDispatch, useSelector } from 'react-redux'

import $orders from '@/store/orders'
import $app from '@/store/app'
import useWalletConnect from './wallet-connect'

const useOrders = ({tokenAddress, type}) => {
  const dispatch = useDispatch()

  const blockchain = useSelector($app.get.blockchain)
  const { wallet } = useWalletConnect()

  const updateOrders = () => {
    if (wallet) {
      $orders.api.get[type]({
        blockchain: blockchain.code,
        maker: wallet,
        includeCriteriaMetadata: true,
        blockchain: blockchain.code,
        address: wallet,
        // sortBy: 'createDateTime',
        statuses: '[1,2]',
      }).then(res => {
        if (res) {
          dispatch($orders.set[type](res))
        }
      })
    }
    
    $orders.api.get[type].orderBook({
      collection: tokenAddress,
      blockchain: blockchain.code,
    }).then(res => {
      dispatch($orders.set.orderBook({type: type, data: res}))
    })
  }

  return {
    updateOrders: updateOrders,
  }
}

export default useOrders
