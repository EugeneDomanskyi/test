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

  const collections = useSelector(({$exchange}) => $exchange.collections)

  useEffect(() => {
    $exchange.api.get.topCollections({includeRecentSales: false, blockchain: 'polygon'}).then(res => {
      dispatch($exchange.set.collections(res))
    })
  }, [])

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
    if (!collectionId && collections.length) {
      const [first] = collections
      router.replace(`${first.id}`)
    }
  }, [collectionId, collections.length])

  return (
    <App.Container sx={{paddingTop: 64+24, minHeight: '100vh'}}>
      <App.Flex>
        <CollectionList collectionId={collectionId} />
        <App.Flex>

        </App.Flex>
        <App.Flex flex={1} gap={16} column>
          <Chart />
          <App.Flex gap={8}>
            <OrderBook collectionId={collectionId} />
            <Sales />
          </App.Flex>
        </App.Flex>
        <App.Flex>
          <TradeForm />
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default Exchange
