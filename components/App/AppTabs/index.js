import { useEffect, useMemo, useRef, useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const AppTabs = ({width = '100%', height = '100%', options, active, end, variant = 'standard', onChange}) => {
  const EndComponent = useMemo(() => {
    return end
  }, [end])

  const parentRef = useRef(null)
  const optionRefs = useRef([])
  const [badgeWidth, setBadgeWidth] = useState(0)
  const [badgeLeft, setBadgeLeft] = useState(0)

  const activeIndex = options.findIndex(item => item.key === active)

  useEffect(() => {
    if (active && optionRefs.current.length == options.length && optionRefs.current[activeIndex]) {
      const optionRect = optionRefs.current[activeIndex].getBoundingClientRect()
      const parentRect = parentRef.current.getBoundingClientRect()

      setBadgeWidth(optionRect.width)
      setBadgeLeft(optionRect.left - parentRect.left)
    }
  }, [active, optionRefs.current])

  return (
    <App.Flex row width={width} height={height} align="center" justify="space-between" className={cn(styles.container, styles[variant])}>
      <div ref={parentRef} className={cn(styles.options, styles[variant])}>
        {variant != 'classic' ? (
          <div className={styles.badge} style={{width: `${badgeWidth}px`, left: `${badgeLeft}px`}} />
        ) : null}

        {options.map((option, index) => {
          const isActive = option.key === active
          return (
            <div key={index} ref={(element) => optionRefs.current[index] = element} className={cn(styles.option, styles[variant], styles[option?.variant], {[styles.disabled]: option.disabled}, {[styles.active]: isActive})} onClick={() => ! option.disabled ? onChange(option.key) : null}>
              <div className={styles.optionInner}>
                <App.Text center size={variant == 'classic' ? 20 : variant == 'back' ? 12 : 14} weight={variant == 'classic' ? 700 : 500} height={1} className={cn(styles.optionText, {[styles.active]: isActive})}>{ option.title }</App.Text>
              </div>
            </div>
          )
        })}
      </div>
      
      {EndComponent}
    </App.Flex>
  )
}

export default AppTabs
