import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { parseUnits } from 'viem'
import cn from 'classnames'

import App from 'components/App'
import AuctionItemSimple from 'components/Auction/AuctionItemSimple'
import AuctionLoader from 'components/Auction/AuctionLoader'

import styles from './styles.module.scss'
import WagmiHelper from '@/libs/WagmiHelper'

const AuctionClaim = ({ item, onClose }) => {
  const { t } = useTranslation()

  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step == 1) {
      transaction()
    }
  }, [step])

  const transaction = async () => {
    const USDC_CONTRACT = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
    const price = parseUnits(item.currentPrice, 6)

    const network = await WagmiHelper.changeChain('base')
    if (!network) {
      return
    }

    const result = await WagmiHelper.transfer(USDC_CONTRACT, item.claimContract, price)
    console.log(result)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleProceed = () => {
    setStep(1)

    // setTimeout(() => {
    //   setStep(2)
    // }, 3000)

    // setTimeout(() => {
    //   setStep(3)
    // }, 6000)

    // setTimeout(() => {
    //   setStep(4)
    // }, 9000)
  }

  const handleScan = () => {
    console.log('Scan')
  }

  const handleShare = () => {
    console.log('Share')
  }

  return (
    <App.Flex column>
      <App.Flex center height={46} className={styles.header}>
        {step == 0 ? (
          <App.Text size={20} weight={600} height={1}>{t('Congratulations!')}</App.Text>
        ) : (
          <App.Flex row center width={260}>
            <App.Flex flex={1} align="center" justify="flex-start" className={styles.half}>
              <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 3})}>
                <App.Icon icon="check" width={8} height={8} />
              </App.Flex>

              <App.Flex className={cn(styles.line, {[styles.active]: step >= 3})} />

              <App.Flex center width={100} className={styles.text}>
                <App.Text size={12} weight={400} height={1} color={step >= 3 ? '#fff' : '#9a9a9a'}>{t('Verify Deposit')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} align="center" justify="flex-end" className={styles.half}>
              <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 4})}>
                <App.Icon icon="check" width={8} height={8} />
              </App.Flex>

              <App.Flex className={cn(styles.line, {[styles.active]: step >= 4})} />

              <App.Flex center width={100} className={cn(styles.text, styles.second)}>
                <App.Text size={12} weight={400} height={1} color={step >= 4 ? '#fff' : '#9a9a9a'}>{t('Confirm NFT')}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        )}

        <App.Flex center className={styles.close} onClick={handleClose}>
          <App.Icon icon="cross" color="#fff" />
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={32} className={styles.content}>
        {step == 0 ? (
          <App.Flex center className={styles.badge}>
            <App.Text size={20} weight={600} height={1} color="#53F19C">{t('You won the auction!')}</App.Text>
          </App.Flex>
        ) : null}

        {step == 1 ? (
          <App.Flex column center gap={12}>
            <App.Text center size={24} weight={600} height={1}>{t('Approve the Transaction!')}</App.Text>
            <App.Text center size={16} weight={400} color="#B9B8C5">{t('Tap "Approve" in your wallet to receive the winning in your wallet')}</App.Text>
          </App.Flex>
        ) : null}

        {step == 2 ? (
          <App.Flex column center gap={12}>
            <App.Text center size={24} weight={600} height={1}>{t('Verifying your deposit')}</App.Text>
            <App.Text center size={16} weight={400} color="#B9B8C5">{t('Please wait, it will take only a few seconds')}</App.Text>
          </App.Flex>
        ) : null}

        {step == 3 ? (
          <App.Flex column center gap={12}>
            <App.Text center size={24} weight={600} height={1}>{t('Transferring your winnings')}</App.Text>
            <App.Text center size={16} weight={400} color="#B9B8C5">{t('Please wait, it will take only a few seconds')}</App.Text>
          </App.Flex>
        ) : null}

        {step == 4 ? (
          <App.Flex column center gap={12}>
            <App.Text center size={24} weight={600} height={1}>{t('Congratulations!')}</App.Text>
            <App.Flex center className={styles.badge}>
              <App.Text size={20} weight={600} height={1} color="#53F19C">{t('Your winnings have been added to your wallet')}</App.Text>
            </App.Flex>
          </App.Flex>
        ) : null}

        {step == 2 || step == 3 ? (
          <AuctionLoader />
        ) : null}

        <AuctionItemSimple item={item} small={step == 2 || step == 3} large={step == 4} />

        {step == 0 ? (
          <App.Flex column gap={16} fullWidth center>
            <App.Text size={20} weight={600} height={1}>{t('Pay the auction amount to claim the NFT')}</App.Text>
            <App.Button primary2 onClick={handleProceed}>{t('Proceed to checkout')}</App.Button>
          </App.Flex>
        ) : null}

        {step == 4 ? (
          <App.Flex row center gap={24} fullWidth>
            <App.Flex center flex={1}>
              <App.Button primary2 outlined fullWidth onClick={handleScan}>{t('View on Explorer')}</App.Button>
            </App.Flex>

            <App.Flex center flex={1}>
              <App.Button primary2 outlined fullWidth onClick={handleShare}>{t('Share Now')}</App.Button>
            </App.Flex>
          </App.Flex>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionClaim