import { useDispatch, useSelector } from 'react-redux'

import $orders from '@/store/orders'
import $app from '@/store/app'
import useWalletConnect from './wallet-connect'

const useOrders = ({tokenAddress, type}) => {
  const dispatch = useDispatch()

  const blockchain = useSelector($app.get.blockchain)
  const { wallet } = useWalletConnect()

  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(tokenAddress)

  const updateOrders = () => {
    if (wallet) {
      $orders.api.get[type]({
        blockchain: blockchain.code,
        maker: wallet,
        includeCriteriaMetadata: true,
        blockchain: blockchain.code,
        address: wallet,
        sortBy: type === 'nfts' ? 'createdAt' : 'createDateTime',
        statuses: '[1,2,3]',
      }).then(res => {
        if (res) {
          dispatch($orders.set[type](res))
        }
      })
    } else {
      dispatch($orders.set[type]([]))
    }

    if (tokenAddress && isAddress) {
      $orders.api.get[type].orderBook({
        collection: tokenAddress,
        address: tokenAddress,
        blockchain: blockchain.code,
        sortBy: type === 'nfts' ? 'createdAt' : 'createDateTime',
        ...(type === 'nfts' ? {} : {statuses: '[1]'})
      }).then(res => {
        dispatch($orders.set.orderBook({type: type, data: res, tokenAddress: tokenAddress}))
      })
      if (type === 'tokens') {
        $orders.api.get.tokens.trades({
          address: tokenAddress,
          blockchain: blockchain.code,
          sortBy: 'createDateTime',
          statuses: '[3]',
          limit: 100,
        }).then(res => {
          dispatch($orders.set.trades({type: 'tokens', data: res}))
        })
      }
    }
  }

  return {
    updateOrders: updateOrders,
  }
}

export default useOrders
