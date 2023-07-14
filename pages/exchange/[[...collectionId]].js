import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import moment from 'moment'

import $exchange from '@/store/exchange'

import App from '@/components/App'
import CollectionList from '@/components/Exchange/CollectionList'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'
import CollectionInfo from '@/components/Exchange/CollectionInfo'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const Exchange = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [collectionId] = router.query.collectionId || []

  const collections = useSelector(({$collection}) => $collection.all)

  useEffect(() => {
    if (collectionId) {
      $exchange.api.get.sales({
        blockchain: 'polygon',
        collection: collectionId,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'asc',
        startTimestamp: moment().subtract(3, 'weeks').unix(),
        limit: 1000,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.sales(res))
        }
      })
    }
  }, [collectionId])

  useEffect(() => {
    if (!collectionId && collections) {
      const [first] = collections
      if (first && 'tvl' in first) {
        router.replace(`${first.address}`)
      }
    }
  }, [collectionId, collections])

  return (
    <App.Container sx={{paddingTop: 64+24, minHeight: '100vh'}}>
      <App.Flex gap={8}>
        <CollectionList collectionId={collectionId} />
        <App.Flex column flex={1} gap={8}>
          <CollectionInfo />
          <App.Flex>
            <App.Flex flex={1} column>
              <Chart />
              <OrderBook collectionId={collectionId} />
              <Sales />
            </App.Flex>
            <TradeForm />
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default Exchange
