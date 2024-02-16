import Link from 'next/link'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useSelector } from 'react-redux'

const HomeStats = () => {
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  return !isMobile ? (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }} className={styles.container}>
      <App.Flex row gap={16}>
        <App.Flex column width={484} gap={16}>
          <App.Flex column gap={16} className={styles.statsBox}>
            <App.Flex row align="center" justify="space-between">
              <App.Flex row center gap={8}>
                <App.Icon icon="wallet3" />
                <App.Text size={16} weight={700} height={1}>Daily Orders</App.Text>
              </App.Flex>

              <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>
            </App.Flex>

            <img src="/images/home/stats-1.png" alt="" className={styles.img} />
          </App.Flex>

          <App.Flex row gap={16}>
            <App.Flex column gap={16} width={283} className={styles.statsBox}>
              <App.Flex row align="center" gap={8}>
                <App.Icon icon="trades" />
                <App.Text size={16} weight={700} height={1}>On-Chain Settled Trades</App.Text>
              </App.Flex>

              <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>

              <img src="/images/home/stats-2.png" alt="" className={styles.img} />
            </App.Flex>

            <App.Flex column gap={16} flex={1}>
              <App.Flex column gap={8} className={styles.statsGradientBox}>
                <App.Flex row fullWidth align="center" justify="space-between">
                  <App.Flex column>
                    <App.Text size={16} weight={700}>Total Orders</App.Text>
                    <App.Text size={16} weight={700} italic family="Playfair Display">Created</App.Text>
                  </App.Flex>

                  <App.Flex center width={44} height={44}>
                    <img src="/images/home/stats-3.png" alt="" className={styles.img} />
                  </App.Flex>
                </App.Flex>

                <App.Text size={44} weight={800}>323</App.Text>
              </App.Flex>

              <App.Flex flex={1} fullWidth className={styles.relative}>
                <App.Flex width={278} column gap={8} className={cn(styles.statsBox, styles.noPadding, styles.absolute, styles.left)}>
                  <App.Flex column full gap={29} justify="flex-end" className={styles.gasBack}>
                    <App.Flex column align="flex-end">
                      <App.Text right size={20} weight={700}>Gas</App.Text>
                      <App.Text size={20} weight={700} italic family="Playfair Display">Saved</App.Text>
                    </App.Flex>

                    <App.Text right size={39} weight={800}>$300,645.61</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={283} gap={16}>
          <App.Flex column gap={14} fullWidth className={styles.statsBox}>
            <App.Flex row align="center" gap={8}>
              <App.Icon icon="shield" />
              <App.Text size={16} weight={700} height={1}>Daily Orders Cancelled</App.Text>
            </App.Flex>

            <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>

            <img src="/images/home/stats-5.png" alt="" className={styles.img} />
          </App.Flex>

          <App.Flex row fullWidth flex={1} gap={16}>
            <App.Flex width={78}></App.Flex>

            <App.Flex column center flex={1} gap={16} className={styles.statsGradientBox}>
              <App.Flex center column>
                <App.Text center size={20} weight={700} height={1.2}>Total Trades Settled</App.Text>
                <App.Text center size={20} weight={700} italic family="Playfair Display">(On-chain)</App.Text>
              </App.Flex>

              <App.Text size={48} weight={700} height={1}>43</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={383} gap={16}>
          <App.Flex row gap={16} fullWidth height={115}>
            <App.Flex width={175} className={styles.relative}>
              <App.Flex column gap={8} className={cn(styles.statsBox, styles.noPadding, styles.absolute, styles.bottom)}>
                <App.Flex column gap={24} height={286} className={styles.volumeBack}>
                  <App.Flex column align="flex-start">
                    <App.Text size={20} weight={700}>Total</App.Text>
                    <App.Text size={20} weight={700} italic family="Playfair Display">Trading</App.Text>
                    <App.Text size={20} weight={700}>Volume</App.Text>
                  </App.Flex>

                  <App.Text size={44} weight={800} height={1}>323</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} className={styles.relative}>
              <App.Flex column center gap={12} height={180} className={cn(styles.statsGradientBox, styles.absolute, styles.bottom)}>
                <App.Flex center column>
                  <App.Text center size={20} weight={700} height={1.2}>Total Orders</App.Text>
                  <App.Text center size={20} weight={700} italic family="Playfair Display">Cancelled</App.Text>
                </App.Flex>

                <App.Text center size={48} weight={700} height={1}>157</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={14} flex={1} fullWidth className={styles.statsBox}>
            <App.Flex row align="center" gap={8}>
              <App.Icon icon="volume" />
              <App.Text size={16} weight={700} height={1}>Daily Trade Volume</App.Text>
            </App.Flex>

            <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>

            <img src="/images/home/stats-6.png" alt="" className={styles.img} />
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex sx={{ paddingTop: 16 }}>
        <App.Text size={14} weight={400} color="#9B99AE" className={styles.bottomText}>Interested in More Statistics? <a href="https://stats.tegro.com/?utm_source=home&utm_medium=tegro&utm_campaign=testnet" target="_blank" rel="noreferrer">View More Stats &gt;</a></App.Text>
      </App.Flex>
    </App.Container>
  ) : (
    <App.Container className={styles.container}>
      <App.Flex column fullWidth gap={16}>
        <App.Flex row gap={16}>
          <App.Flex flex={6} column gap={8} className={cn(styles.statsBox, styles.noPadding)}>
            <App.Flex column full gap={29} justify="flex-end" className={styles.gasBack}>
              <App.Flex column align="flex-end">
                <App.Text right size={20} weight={700}>Gas</App.Text>
                <App.Text size={20} weight={700} italic family="Playfair Display">Saved</App.Text>
              </App.Flex>

              <App.Text right size={28} weight={800}>$300,645.61</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex flex={4} column gap={8} className={styles.statsGradientBox} sx={{ padding: '24px 16px' }}>
            <App.Flex column>
              <App.Text size={16} weight={700}>Total</App.Text>
              <App.Text size={16} weight={700}>Orders</App.Text>
              <App.Text size={16} weight={700} italic family="Playfair Display">Created</App.Text>
            </App.Flex>

            <App.Text size={44} weight={800}>323</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.statsBox}>
          <App.Flex row align="center" justify="space-between">
            <App.Flex row center gap={8}>
              <App.Icon icon="wallet3" />
              <App.Text size={16} weight={700} height={1}>Daily Orders</App.Text>
            </App.Flex>

            <App.Text size={12} weight={500} color="#9B99AE">Jan 07, 12:00 AM</App.Text>
          </App.Flex>

          <img src="/images/home/stats-1.png" alt="" className={styles.img} />
        </App.Flex>

        <App.Flex column gap={14} fullWidth className={styles.statsBox}>
          <App.Flex row align="center" gap={8}>
            <App.Icon icon="shield" />
            <App.Text size={16} weight={700} height={1}>Daily Orders Cancelled</App.Text>
          </App.Flex>

          <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>

          <img src="/images/home/stats-5.png" alt="" className={styles.img} />
        </App.Flex>

        <App.Flex column center fullWidth gap={16} className={styles.statsGradientBox}>
          <App.Flex center column>
            <App.Text center size={20} weight={700} height={1.2}>Total Trades Settled</App.Text>
            <App.Text center size={20} weight={700} italic family="Playfair Display">(On-chain)</App.Text>
          </App.Flex>

          <App.Text size={48} weight={700} height={1}>43</App.Text>
        </App.Flex>

        <App.Flex column gap={16} fullWidth className={styles.statsBox}>
          <App.Flex row align="center" gap={8}>
            <App.Icon icon="trades" />
            <App.Text size={16} weight={700} height={1}>On-Chain Settled Trades</App.Text>
          </App.Flex>

          <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>

          <img src="/images/home/stats-2.png" alt="" className={styles.img} />
        </App.Flex>

        <App.Flex row gap={16}>
          <App.Flex column flex={1} gap={8} className={cn(styles.statsBox, styles.noPadding)}>
            <App.Flex column gap={24} height={286} className={styles.volumeBack}>
              <App.Flex column align="flex-start">
                <App.Text size={20} weight={700}>Total</App.Text>
                <App.Text size={20} weight={700} italic family="Playfair Display">Trading</App.Text>
                <App.Text size={20} weight={700}>Volume</App.Text>
              </App.Flex>

              <App.Text size={44} weight={800} height={1}>323</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column center gap={12} flex={1} className={cn(styles.statsGradientBox)}>
            <App.Flex center column>
              <App.Text center size={20} weight={700} height={1.2}>Total Orders</App.Text>
              <App.Text center size={20} weight={700} italic family="Playfair Display">Cancelled</App.Text>
            </App.Flex>

            <App.Text center size={48} weight={700} height={1}>157</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={14} fullWidth className={styles.statsBox}>
          <App.Flex row align="center" gap={8}>
            <App.Icon icon="volume" />
            <App.Text size={16} weight={700} height={1}>Daily Trade Volume</App.Text>
          </App.Flex>

          <App.Text size={12} weight={500} color="#9B99AE">Created at Jan 07, 12:00 AM</App.Text>

          <img src="/images/home/stats-6.png" alt="" className={styles.img} />
        </App.Flex>
      </App.Flex>

      <App.Flex center sx={{ paddingTop: 16 }}>
        <App.Text center size={14} weight={400} color="#9B99AE" className={styles.bottomText}>Interested in More Statistics? <a href="https://stats.tegro.com/?utm_source=home&utm_medium=tegro&utm_campaign=testnet" target="_blank" rel="noreferrer">View More Stats &gt;</a></App.Text>
      </App.Flex>
    </App.Container>
  )
}

export default HomeStats