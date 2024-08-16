import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { parseUnits } from 'viem'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'
import WagmiHelper from '@/libs/WagmiHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $app from 'store/app'
import $gem from 'store/gem'
import $alert from 'store/alert'

import App from 'components/App'
import AuctionItemSimple from 'components/Auction/AuctionItemSimple'
import AuctionLoader from 'components/Auction/AuctionLoader'
import AuctionShareImage from '../AuctionShareImage'

import styles from './styles.module.scss'

const AuctionClaim = ({ item, onClose }) => {
  const { t } = useTranslation()

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const jwt = useSelector(({ $gem }) => $gem.jwt)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const claimImage = useSelector(({ $gem }) => $gem.claimImage)

  const [step, setStep] = useState(0)
  const [scanLink, setScanLink] = useState(null)
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (step == 1) {
      transaction()
    }
  }, [step])

  const transaction = async () => {
    setScanLink(null)
    const price = parseUnits(item.currentPrice, item.token.decimals)

    const txid = await WagmiHelper.transfer(item.token.address, item.claimContract, price)
    if (txid) {
      setStep(2)

      const temp = await WagmiHelper.waitForTransaction(txid)
      if (temp) {
        setStep(3)
        const result = await $gem.api.claim({
          auction_id: item.id,
          tx_hash: txid,
          jwt_token: jwt,
        })

        if (result && !result?.error) {
          setStep(4)
          setScanLink(WagmiHelper.generateScanUrl(result.auction.claim_tx_hash, 'tx'))
          dispatch($gem.set.auctionUpdated({data: result, wallet}))

          Amplitude.event(`Prize Claimed`, {
            'Page': 'Auction',
          })
          
          return
        } else {
          dispatch($alert.set.error({title: result?.error}))
        }
      }
    }

    setLoading(false)
    setStep(0)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleProceed = async () => {
    setLoading(true)

    const chainCode = (window.location.hostname == 'tegro.com' || window.location.hostname == 'nft20-git-production-toraverse.vercel.app' || (window.location.hostname == 'testnet.tegro.com' && item.id >= 3)) ? 'base' : 'amoy' 
    const network = await WagmiHelper.changeChain(chainCode)
    if (!network) {
      setLoading(false)
      dispatch($alert.set.error({title: 'Something went wrong'}))
      return
    }
    dispatch($app.set.code(chainCode))

    const balance = await WagmiHelper.balanceOf(item.token.address, chainCode)
    if (balance >= item.currentPrice) {
      setStep(1)
    } else {
      dispatch($alert.set.error({title: 'Insufficient balance'}))
    }

    setLoading(false)
  }

  const handleShare = () => {
    const link = `${window.location.origin}/auctions`
    const tweetText = claimImage ? `${link}?share=${claimImage}` : encodeURIComponent(`
🚀 Unbelievable! I just bagged ${item.name} for just ${item.currentPrice} ${item.token.currency} on Tegro! 👀

That's a whopping ${item.discount}% off! 😱

You don't wanna miss these insane deals! ✨

🔗 Connect your wallet & place the BID now at ${link}
    `)

    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')

    Amplitude.event(`Shared winnings`, {
      'Page': 'Auction',
    })

    setShared(true)
  }

  const handleImageGenerate = () => {
    setImageLoading(false)
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

      <App.Flex column center gap={16} className={styles.content}>
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
              <App.Text center size={[20, 16]} weight={600} height={1} color="#53F19C">{t('Your winnings have been added to your wallet')}</App.Text>
            </App.Flex>
          </App.Flex>
        ) : null}

        {step == 2 || step == 3 ? (
          <AuctionLoader />
        ) : null}

        <AuctionItemSimple item={item} large={step == 4} />

        {step == 0 ? (
          <App.Flex column gap={16} fullWidth center>
            <App.Text center size={[20, 16]} weight={600} height={1}>{shared ? t(`Pay {{price}} {{currency}} to claim {{title}}`, {price: item.currentPrice, currency: item.token.currency, title: item.name}) : t('Complete the Steps to Claim Your Rewards')}</App.Text>

            <App.Flex row align="center" justify="space-between" className={styles.steps}>
              <App.Flex center className={cn(styles.circle, styles.active)}>
                {shared ? <App.Icon icon="check" /> : <App.Text center size={14} weight={700} height={1}>1</App.Text>}
              </App.Flex>

              <App.Flex center className={cn(styles.circle, {[styles.active]: shared})}>
                <App.Text center size={14} weight={700} height={1}>2</App.Text>
              </App.Flex>

              <App.Flex className={styles.line} />

              <App.Flex center className={cn(styles.words, styles.left)}>
                <App.Text size={12} weight={400} height={1}>Share on Twitter</App.Text>
              </App.Flex>

              <App.Flex center className={cn(styles.words, styles.right)}>
                <App.Text size={12} weight={400} height={1}>Claim Rewards</App.Text>
              </App.Flex>
            </App.Flex>

            {shared ? (
              <App.Button primary2 medium fullWidth loading={loading} onClick={handleProceed}>{t('Proceed to checkout')}</App.Button>
            ) : (
              <App.Button loading={imageLoading} disabled={imageLoading} twitter medium fullWidth onClick={handleShare}><App.Icon icon="x2" /> {t('Tweet Now')}</App.Button>
            )}

            <App.Flex row center gap={8}>
              <App.Text size={14} weight={600} color="#FF1D61" height={1}>Claim your winnings within 72 hours!</App.Text>
              <App.Tooltip variant="v2" click={isMobile} text={'You have to claim your winnings within 72 hours. If not, it gets deposited back to the reward pool.'} placement="top-end">
                <App.Icon icon="info2" width={20} height={20} />
              </App.Tooltip>
            </App.Flex>
          </App.Flex>
        ) : null}

        {step == 4 ? (
          <App.Flex row center gap={24} fullWidth>
            <App.Flex center flex={1}>
              <App.Button primary2 outlined fullWidth href={scanLink}>{t('View on Explorer')}</App.Button>
            </App.Flex>

            <App.Flex center flex={1}>
              <App.Button primary2 outlined fullWidth onClick={handleShare}>{t('Share Now')}</App.Button>
            </App.Flex>
          </App.Flex>
        ) : null}
      </App.Flex>

      <AuctionShareImage onFinish={handleImageGenerate} />
    </App.Flex>
  )
}

export default AuctionClaim