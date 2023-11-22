import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'

import { trackEvent, getPageName } from '@/libs/analytics.lib'

import App from '@/components/App'
import WrapperCollections from '@/components/Wrapper/WrapperCollections'

const HomeTop = dynamic(import('@/components/Home/HomeTop'), { ssr: false })
const HomeTable = dynamic(import('@/components/Home/HomeTable'), { ssr: false })
// const HomeEarn = dynamic(import('@/components/Home/HomeEarn'), { ssr: false })
// const HomeUsing = dynamic(import('@/components/Home/HomeUsing'), { ssr: false })
// const HomeGuide = dynamic(import('@/components/Home/HomeGuide'), { ssr: false })

export default function Home() {
  const loading = useSelector(({ $collection }) => $collection.loading)

  useEffect(() => {
    trackEvent('Page Visited', {
      'Page Name': getPageName(),
    })
  }, [])

  return (
    <WrapperCollections>
      <App.Flex column sx={{ paddingBottom: 48, overflow: 'hidden' }}>
        <App.Flex column gap={64}>
          <App.Flex column gap={48}>
            <HomeTop />
            {loading ? (
              <App.LoaderBlock height={600} />
            ) : (
              <HomeTable />
            )}
          </App.Flex>

          {/* <HomeEarn />
          <HomeUsing />
          <HomeGuide /> */}
        </App.Flex>
      </App.Flex>
    </WrapperCollections>
  )
}
