import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

import $exchange from '@/store/exchange'
import $app from '@/store/app'

import App from '@/components/App'
import TokenList from '@/components/TokenList'
import OrderBook from '@/components/OrderBook'

const Exchange = () => {
  const router = useRouter()

  const token = useSelector($app.get.token('code', router.query.tokenId))

  return (
    <App.Container sx={{paddingTop: 64}}>
      <App.Flex>
        <App.Flex>
          <TokenList />
        </App.Flex>
        <App.Flex flex={1}>
          <OrderBook collection={token?.ognft} />
        </App.Flex>
      </App.Flex>
      
    </App.Container>
  )
}

export default Exchange
