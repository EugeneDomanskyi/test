import { useSelector } from 'react-redux'

export const usePropsHelper = () => {
  const {isMobile, windowWidth, windowHeight} = useSelector(({$app}) => $app.size)

  const isNumber = (str) => {
    return /^\d+(\.\d+)?$/.test(str)
  }

  const propValue = (value, hasNotPx = false) => {
    if (value) {
      if (typeof value == 'object' || typeof value == 'array') {
        if (value.hasOwnProperty(0) && value.hasOwnProperty(1)) {
          const result = isMobile ? value[1] : value[0]
          return isNumber(result) && ! hasNotPx ? (result + 'px') : result
        } else {
          if (value.hasOwnProperty('max') || value.hasOwnProperty('min')) {
            const type = value.hasOwnProperty('max') ? 'max' : 'min'
            const sizes = []

            let result = null
            for (const key in value.max) {
              if (key == 'default') {
                result = value.max[key]
              } else {
                sizes.push({
                  breakpoint: key * 1,
                  value: value.max[key],
                })
              }
            }

            sizes.sort((a, b) => { return type == 'max' ? b.breakpoint - a.breakpoint : a.breakpoint - b.breakpoint })
            for (const size of sizes) {
              if (type == 'max' && windowWidth <= size.breakpoint) {
                result = size.value
              }

              if (type == 'min' && windowWidth >= size.breakpoint) {
                result = size.value
              }
            }

            return isNumber(result) && ! hasNotPx ? (result + 'px') : result
          }
        }
      }
    
      if (typeof value == 'string' || typeof value == 'number') {
        return isNumber(value) && ! hasNotPx ? (value + 'px') : value
      }
    
      return isNumber(value) && ! hasNotPx ? (value + 'px') : value
    }

    return value
  }

  return { isMobile, isNumber, propValue }
}