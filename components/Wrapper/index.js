import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import useApp from '@/myhooks/useApp'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'

import Header from '@/components/Header'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()

  const router = useRouter()
  const isCampaign = router.asPath?.includes('/campaign') || router.asPath?.includes('/tournament')

  const { isApp } = useApp()
  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, !isApp)

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

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
    <div style={{height: '100%', paddingTop: isCampaign || isApp ? 0 : 64, transition: '.4s', overflowX: 'hidden'}}>
      <Analytics />
      {!isCampaign && !isApp ? <Header /> : null}
      {children}
    </div>
  )
}

export default Wrapper