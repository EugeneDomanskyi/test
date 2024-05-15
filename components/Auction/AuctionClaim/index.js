import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import App from 'components/App'
import AuctionItemSimple from 'components/Auction/AuctionItemSimple'

import styles from './styles.module.scss'

const AuctionClaim = ({ item, onClose }) => {
  const { t } = useTranslation()

  const [step, setStep] = useState(0)

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleProceed = () => {
    setStep(1)
  }

  return (
    <App.Flex column>
      <App.Flex center height={46} className={styles.header}>
        {step == 0 ? (
          <App.Text size={20} weight={600} height={1}>{t('Congratulations!')}</App.Text>
        ) : (
          <App.Flex row center width={260}>
            <App.Flex flex={1} align="center" justify="flex-start" className={styles.half}>
              <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 2})}>
                <App.Icon icon="check" width={8} height={8} />
              </App.Flex>

              <App.Flex className={cn(styles.line, {[styles.active]: step >= 2})} />

              <App.Flex center width={100} className={styles.text}>
                <App.Text size={12} weight={400} height={1} color={step >= 2 ? '#fff' : '#9a9a9a'}>{t('Verify Deposit')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} align="center" justify="flex-end" className={styles.half}>
              <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 2})}>
                <App.Icon icon="check" width={8} height={8} />
              </App.Flex>

              <App.Flex className={cn(styles.line, {[styles.active]: step >= 2})} />

              <App.Flex center width={100} className={cn(styles.text, styles.second)}>
                <App.Text size={12} weight={400} height={1} color={step >= 2 ? '#fff' : '#9a9a9a'}>{t('Confirm NFT')}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        )}

        <App.Flex center className={styles.close} onClick={handleClose}>
          <App.Icon icon="cross" color="#fff" />
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={32} className={styles.content}>
        <App.Flex center className={styles.badge}>
          <App.Text size={20} weight={600} height={1} color="#53F19C">{t('You won the auction!')}</App.Text>
        </App.Flex>

        <AuctionItemSimple item={item} />

        <App.Flex column gap={16} fullWidth center>
          <App.Text size={20} weight={600} height={1}>{t('Pay the auction amount to claim the NFT')}</App.Text>
          <App.Button primary2 onClick={handleProceed}>{t('Proceed to checkout')}</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionClaim