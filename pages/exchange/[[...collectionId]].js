import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import $collection from '@/store/collection'
import Stream from '@/libs/stream.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import CollectionList from '@/components/Exchange/CollectionList'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'
import CollectionInfo from '@/components/Exchange/CollectionInfo'
import Orders from '@/components/Exchange/Orders'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const GRID_GAP = 6

const Exchange = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [collectionId] = router.query.collectionId || []

  const { wallet } = useWalletConnect()
  const socketConnected = useSelector(({$app}) => $app.socketConnected)
  const blockchain = useSelector($app.get.blockchain)
  const { collections, isLoading } = useSelector($collection.get.all)

  useEffect(() => {
    Stream.on('sale', (event, data) => {
      switch (event) {
        case 'sale.created':
          dispatch($exchange.set.saleAdd(data))
          break
        case 'sale.updated':
          dispatch($exchange.set.saleUpdate(data))
          break
      }
    })
    Stream.on('bid', (event, data) => {
      if (wallet && wallet.toLowerCase() !== data.maker.toLowerCase()) {
        return
      }
      dispatch($exchange.set.orderUpdate(data))
    })
    Stream.on('ask', (event, data) => {
      if (wallet && wallet.toLowerCase() !== data.maker.toLowerCase()) {
        return
      }
      dispatch($exchange.set.orderUpdate(data))
    })
  }, [wallet])

  useEffect(() => {
    if (collectionId) {
      $exchange.api.get.sales({
        blockchain: blockchain.code,
        collection: collectionId,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'desc',
        limit: 1000,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.sales(res))
        }
      })
    }
  }, [collectionId])

  useEffect(() => {
    if (blockchain.code && collectionId && wallet) {
      $exchange.api.get.orders({
        blockchain: blockchain.code,
        collection: collectionId,
        maker: wallet,
        includeCriteriaMetadata: true,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orders(res))
        }
      })
    }
  }, [blockchain.code, collectionId, wallet])
  
  useEffect(() => {
    if (socketConnected && collectionId) {
      Stream.subscribe('sale.*', [collectionId])
      Stream.subscribe('bid.*', [collectionId])
      Stream.subscribe('ask.*', [collectionId])
    }
    return () => {
      Stream.unsubscribe('sale.*')
      Stream.unsubscribe('bid.*')
      Stream.unsubscribe('ask.*')
    }
  }, [socketConnected, collectionId])

  useEffect(() => {
    if (!isLoading) {
      const isSameBlockchain = collections.find(c => c.address === collectionId)
      if (!collectionId || !isSameBlockchain) {
        const [first] = collections
        router.replace(`${first.address}`)
      }
    }
  }, [isLoading, blockchain.code, collectionId])

  return (
    <App.Container sx={{paddingTop: 64+24, minHeight: '100vh'}}>
      <App.Flex gap={GRID_GAP}>
        <CollectionList collectionId={collectionId} />
        <App.Flex column flex={1} gap={GRID_GAP}>
          <CollectionInfo collectionId={collectionId} />
          <App.Flex gap={GRID_GAP}>
            <App.Flex flex={1} column gap={GRID_GAP}>
              <Chart />
              <App.Flex gap={GRID_GAP}>
                <OrderBook collectionId={collectionId} />
                <Sales />
              </App.Flex>
            </App.Flex>
            <App.Flex column gap={GRID_GAP}>
              <App.Flex>
                <TradeForm collectionId={collectionId} />
              </App.Flex>
              <Orders />
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default Exchange
