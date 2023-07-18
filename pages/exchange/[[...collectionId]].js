import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import moment from 'moment'

import $exchange from '@/store/exchange'
import $collection from '@/store/collection'
import Stream from '@/libs/stream.lib'

import App from '@/components/App'
import CollectionList from '@/components/Exchange/CollectionList'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'
import CollectionInfo from '@/components/Exchange/CollectionInfo'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const GRID_GAP = 6

const Exchange = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [collectionId] = router.query.collectionId || []

  const { blockchain, socketConnected } = useSelector(({$app}) => ({blockchain: $app.blockchain, socketConnected: $app.socketConnected}))
  const { collections, isLoading } = useSelector($collection.get.all)

  useEffect(() => {
    Stream.on('sale', (data) => {
      console.log('sale -> ', data)
    })
  }, [])

  useEffect(() => {
    if (collectionId) {
      $exchange.api.get.sales({
        blockchain: blockchain,
        collection: collectionId,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'desc',
        // startTimestamp: moment().subtract(3, 'weeks').unix(),
        limit: 1000,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.sales(res))
        }
      })
    }
  }, [collectionId])
  
  useEffect(() => {
    if (socketConnected && collectionId) {
      Stream.subscribe('sale.*', [collectionId])
    }
    return () => {
      Stream.unsubscribe('sale.*')
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
  }, [isLoading, blockchain, collectionId])

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
            <App.Flex column>
              <TradeForm collectionId={collectionId} />
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default Exchange
