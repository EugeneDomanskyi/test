import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { trackEvent, getPageName } from '@/libs/analytics.lib'

import $app from '@/store/app'

import Header from '@/components/Header'
import WrapperCollections from '@/components/Wrapper/WrapperCollections'
import Analytics from '@/components/Analytics'

const Wrapper = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const isNfts = router.asPath?.includes('nfts')
  const isSwap = router.pathname.includes('/swap')

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  useEffect(() => {
    trackEvent('Page Visited', {
      'Page Name': getPageName(),
    })
  }, [router.asPath])

  const getWindowSize = () => {
    if (typeof window !== 'undefined') {
      const {innerWidth, innerHeight} = window
      return {width: innerWidth, height: innerHeight}
    }
  
    return {width: null, height: null}
  }

  const handleWindowResize = () => {
    dispatch($app.set.size(getWindowSize()))
  }

  return (
    <div style={{height: '100%', paddingTop: 64, transition: '.4s', overflowX: 'hidden'}}>
      <Header />

      {isNfts || isSwap ? (
        <WrapperCollections>
          {children}
        </WrapperCollections>
      ) : children}

      <Analytics />
    </div>
  )
}

export default Wrapper