import { useEffect, useState } from 'react'

export const usePropsHelper = () => {
  const getWindowSize = () => {
    if (typeof window !== 'undefined') {
      const {innerWidth, innerHeight} = window
      return {width: innerWidth, height: innerHeight}
    }
  
    return {width: null, height: null}
  }
  
  const [isMobile, setIsMobile] = useState(getWindowSize().width != null && getWindowSize().width <= 768)

  const handleWindowResize = () => {
    setIsMobile(getWindowSize().width <= 768)
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