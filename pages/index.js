import { useSelector } from 'react-redux'

import App from '@/components/App'
import HomeTop from '@/components/HomeTop'
import HomeTable from '@/components/HomeTable'

export default function Home() {
  const { tokens, loadingTokens: loading } = useSelector(({$app}) => $app)

  return (
    <App.Flex column>
      {loading ? (
        <App.LoaderBlock height={600} />
      ) : (
        <>
          <HomeTop tokens={tokens} />
          <HomeTable tokens={tokens} />
          <App.Flex center sx={{ padding: 24 }}>
            <App.Text>Proudly powered by <a href="https://tegro.com" target="_blank" rel="noreferrer" style={{textDecoration: 'underline'}}>Tegro</a></App.Text>
          </App.Flex>
        </>
      )}
    </App.Flex>
  )
}
