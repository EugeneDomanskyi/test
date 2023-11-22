import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import $app from '@/store/app'

import Header from '@/components/Header'
import Analytics from '@/components/Analytics'

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    handleWindowResize()
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
    <div style={{height: '100%', paddingTop: 64, transition: '.4s', overflowX: 'hidden'}}>
      <Header />

      {children}

      <Analytics />
    </div>
  )
}

export default Wrapper