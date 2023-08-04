import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import App from '@/components/App'
import Market from '@/components/Market'

export default function Markets() {
  const router = useRouter()

  const [marketId] = router.query.marketId || []
  const { loading } = useSelector(({ $collection }) => $collection)
  console.log('marketId', marketId);

  return (
    <App.Container>
      <App.Flex sx={{ paddingBottom: 48, paddingTop: 64, overflow: 'hidden' }} gap={32}>
        <App.Flex column sx={{flex: .8}}>
          <Market.Details />
        </App.Flex>

        <App.Flex column  sx={{flex: .3, height: 1000}} gap={48}>
          <Market.Trading />
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}
