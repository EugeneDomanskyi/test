import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import $app from '@/store/app'

export const usePropsHelper = () => {
  const dispatch = useDispatch()

  const isMobile = useSelector(({$app}) => $app.isMobile)

  const getWindowSize = () => {
    if (typeof window !== 'undefined') {
      const {innerWidth, innerHeight} = window
      return {width: innerWidth, height: innerHeight}
    }
  
    return {width: null, height: null}
  }

  const handleWindowResize = () => {
    dispatch($app.set.isMobile(getWindowSize().width <= 768))
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const isNumber = (str) => {
    return /^\d+(\.\d+)?$/.test(str)
  }

  const propValue = (value, hasNotPx = false) => {
    if (typeof value == 'object' || typeof value == 'array') {
      if (value.hasOwnProperty(0) && value.hasOwnProperty(1)) {
        const result = isMobile ? value[1] : value[0]
        return isNumber(result) && ! hasNotPx ? (result + 'px') : result
      }
    }
  
    if (typeof value == 'string' || typeof value == 'number') {
      return isNumber(value) && ! hasNotPx ? (value + 'px') : value
    }
  
    return isNumber(value) && ! hasNotPx ? (value + 'px') : value
  }

  return { isMobile, isNumber, propValue }
}