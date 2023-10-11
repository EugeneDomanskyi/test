import styles from './styles.module.scss'
import App from '@/components/App'
import { useRef, useEffect, useState } from 'react'

const Tabs = ({options, active, onChange}) => {
  const activeIndex = options.findIndex(opt => opt.key === active)

  const [badgeWidth, setBadgeWidth] = useState({})

  const tabRefs = useRef([])
  
  const badgeTranslate = Object.values(badgeWidth).slice(0, activeIndex).reduce((acc, width) => acc + width, 0)

  useEffect(() => {
    setBadgeWidth(tabRefs.current.reduce((acc, el, index) => {
      return {
        ...acc,
        [index]: el.offsetWidth
      }
    }, {}))
  }, [])

  const handleClick = (option) => () => {
    onChange(option.key)
  }

  return (
    <App.Flex className={styles.container}>
      {
        options.map((option, i) => {
          const isActive = option.key === active
          return (
            <div key={option.key} className={styles.tab} ref={ref => tabRefs.current[i] = ref} onClick={handleClick(option)}>
              <App.Text color={isActive ? '#B9B8C5' : '#5E5C6B'} size={12} weight={600}>{option.title}</App.Text>
            </div>
          )
        })
      }
      <div
        className={styles.badge}
        style={{
          width: `${badgeWidth[activeIndex]}px`,
          transform: `translateX(${badgeTranslate}px)`,
        }} />
    </App.Flex>
  )
}

export default Tabs
