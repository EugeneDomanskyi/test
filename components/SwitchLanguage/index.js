import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setCookie } from 'nookies'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwitchLanguage = () => {
  const { i18n } = useTranslation()

  const [open, setOpen] = useState(false)

  const list = [
    { value: 'en', label: 'EN' },
    { value: 'fr', label: 'FR' },
    { value: 'de', label: 'DE' },
  ]

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleLanguage = (value) => () => {
    i18n.changeLanguage(value)
    setCookie(null, 'language', value, {path: '/'})
    setOpen(false)
  }

  return (
    <App.Flex className={styles.container}>
      <App.Flex column className={styles.containerInner}>
        <App.Flex row center gap={8} className={styles.top} onClick={handleToggle}>
          <App.Text weight={600}>{ list.find(item => item.value == i18n.language)?.label }</App.Text>
          <App.Icon icon="chevron-down2" />
        </App.Flex>

        <App.Flex fullWidth className={cn(styles.bottom, {[styles.open]: open})}>
          <App.Flex column fullWidth gap={4} className={styles.bottomInner}>
            {list.map(item => (
              <App.Flex key={item.value} fullWidth height={22} center className={cn(styles.item, {[styles.active]: item.value == i18n.language})} onClick={handleLanguage(item.value)}>
                <App.Text weight={600}>{ item.label }</App.Text>
              </App.Flex>
            ))}
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default SwitchLanguage