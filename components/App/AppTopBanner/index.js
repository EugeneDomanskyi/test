import cn from 'classnames'

import AppFlex from '@/components/App/AppFlex'
import AppIcon from '@/components/App/AppIcon'

import styles from './styles.module.scss'
import { useEffect, useState } from 'react'

const AppTopBanner = ({ children, id, mode = 'light' }) => {
  const [hide, setHide] = useState(true)

  useEffect(() => {
    checkBannerVisibility()
  }, [])

  const checkBannerVisibility = () => {
    const storedValue = localStorage.getItem('top-banners')
    if (storedValue) {
      const list = JSON.parse(storedValue)
      if (!list.includes(id)) {
        setHide(false)
      }
    } else {
      setHide(false)
    }
  }

  const handleClose = () => {
    setHide(true)

    let list = []
    const storedValue = localStorage.getItem('top-banners')
    if (storedValue) {
      list = JSON.parse(storedValue)
    } else {
      list = []
    }

    if (!list.includes(id)) {
      list.push(id)
      localStorage.setItem('top-banners', JSON.stringify(list))
    }
  }

  return (
    <AppFlex fullWidth center className={cn(styles.banner, {[styles.hide]: hide})}>
      {children}

      <AppIcon icon="cross" className={cn(styles.close, styles[mode])} onClick={handleClose} />
    </AppFlex>
  )
}

export default AppTopBanner