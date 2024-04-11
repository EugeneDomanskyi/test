import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'

import styles from './styles.module.scss'

const PointsBar = () => {
  const { t } = useTranslation()
  const { connection } = useWalletConnect()

  return (
    <App.Flex className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex fullWidth height={62} row align="center" justify="space-between">
          {!connection.loading && connection.connected ? (
            'Tabs'
          ) : (
            <App.Flex />
          )}

          <App.Flex center gap={[20, 10]}>
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