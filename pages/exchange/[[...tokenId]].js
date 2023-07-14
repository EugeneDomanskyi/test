import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import moment from 'moment'

import $exchange from '@/store/exchange'
import $app from '@/store/app'

import App from '@/components/App'
import TokenList from '@/components/Exchange/TokenList'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const Exchange = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [tokenId] = router.query.tokenId || []

  const collections = useSelector(({$exchange}) => $exchange.collections)

  useEffect(() => {
    $exchange.api.get.topCollections({includeRecentSales: false, blockchain: 'polygon'}).then(res => {
      dispatch($exchange.set.collections(res))
    })
  }, [])

  useEffect(() => {
    if (tokenId) {
      $exchange.api.get.sales({
        blockchain: 'polygon',
        collection: tokenId,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'asc',
        startTimestamp: moment().subtract(2, 'weeks').unix(),
        // limit: 1000
      }).then(res => {
        if (res) {
          dispatch($exchange.set.sales(res))
        }
      })
    }
  }, [tokenId])

  useEffect(() => {
    if (!tokenId && collections.length) {
      const [first] = collections
      router.replace(`${first.id}`)
    }
  }, [tokenId, collections.length])

  return (
    <App.Container sx={{paddingTop: 64, minHeight: '100vh'}}>
      <App.Flex>
        <App.Flex>
          <TokenList />
        </App.Flex>
        <App.Flex flex={1} gap={16} column>
          <Chart />
          <App.Flex gap={8}>
            <OrderBook collection={tokenId} />
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
