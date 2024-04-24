import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'

import styles from './styles.module.scss'

const PointsBar = ({ tabs, tab, onTab }) => {
  const { t } = useTranslation()
  const { wallet, connection } = useWalletConnect()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const handletab = (value) => () => {
    if (onTab) {
      onTab(value)
    }
  }

  return (
    <App.Flex className={styles.container}>
      <App.Container maxWidth={1230} sx={[null, { padding: 0 }]}>
        <App.Flex direction={['row', 'column']} fullWidth height={[62, 'auto']} gap={16} align={['center', 'flex-end']} justify={['space-between', 'center']} sx={[null, { paddingTop: 16, paddingBottom: 16 }]}>
          {wallet ? (
            <App.Flex row order={[1, 2]} className={styles.tabsBox}>
              <App.Flex row align="center" gap={16} sx={[null, { paddingLeft: 16, paddingRight: 16 }]}>
                {tabs.map(item => (
                  <App.Flex key={item.key} center className={cn(styles.tab, {[styles.active]: item.key == tab})} onClick={handletab(item.key)}>
                    <App.Text className={styles.text}>{item.title}</App.Text>
                  </App.Flex>
                ))}
              </App.Flex>
            </App.Flex>
          ) : (
            !isMobile ? <App.Flex order={[1, 2]} /> : null
          )}

          <App.Flex center gap={[20, 10]} order={[2, 1]} sx={[null, { paddingLeft: 16, paddingRight: 16 }]}>
            <Link href="/points-dashboard/faq">
              <App.Icon icon="question-circle" />
            </Link>

            <SwitchLanguage />
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsBar