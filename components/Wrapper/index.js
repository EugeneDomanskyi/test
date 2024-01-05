import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import $app from '@/store/app'

import Header from '@/components/Header'
// import Analytics from '@/components/Analytics'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()

  const router = useRouter()
  const isCampaign = router.asPath?.includes('/campaign')

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
    <div style={{height: '100%', paddingTop: isCampaign ? 0 : 64, transition: '.4s', overflowX: 'hidden'}}>
      {! isCampaign ? <Header /> : null}
      {children}
      <Analytics />
    </div>
  )
}

export default Wrapper