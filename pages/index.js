import { useSelector } from 'react-redux'

import App from '@/components/App'
import HomeTop from '@/components/HomeTop'
import HomeTable from '@/components/HomeTable'
import HomeEarn from '@/components/HomeEarn'
import HomeUsing from '@/components/HomeUsing'
import HomeGuide from '@/components/HomeGuide'

export default function Home() {
  const { tokens, loadingTokens: loading } = useSelector(({$app}) => $app)

  return (
    <App.Flex column sx={{ paddingBottom: 48, overflow: 'hidden' }}>
      <App.Flex column gap={[96, 64]}>
        <App.Flex column gap={48}>
          <HomeTop tokens={tokens} />
          {loading ? (
            <App.LoaderBlock height={600} />
          ) : (
            <HomeTable tokens={tokens} />
          )}
        </App.Flex>

        <HomeEarn />
        <HomeUsing />
        <HomeGuide />
      </App.Flex>
    </App.Flex>
  )
}
