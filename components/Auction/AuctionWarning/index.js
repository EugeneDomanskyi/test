import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionWarning = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const auctionWarning = useSelector(({ $gem }) => $gem.auctionWarning)

  const handleClose = () => {
    dispatch($gem.set.auctionWarning(false))
  }

  const handleExchange = () => {
    router.push('/exchange')
  }

  const handleShare = () => {
    $gem.api.addGems(wallet, { reason: 'twitter_share' })

    const link = `${window.location.origin}/gems-dashboard#auction`
    const tweetText = encodeURIComponent(`
👀 1 ETH for just $100? Absolutely! ✨

Grab it on Tegro auctions! 🐯

Bid with Gems & bag cryptos at insane prices! ⚡️

Time to stop buying the dip and start placing bids! ✅

Don't fade, join the fun today: ${link}
`)
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')

    handleClose()
  }

  return (
    <App.Dialog open={auctionWarning} onClose={handleClose} hideHeader>
      <App.Flex column gap={24} sx={{ padding: 16 }}>
        <App.Flex row justify="space-between" gap={16}>
          <App.Flex column gap={4}>
            <App.Text size={24} weight={600} height={1}>{t('You do not have enough gems to bid :(')}</App.Text>
            <App.Text size={16} weight={400} color="#FFFFFF99">{t('Don’t worry, we got you covered!')}</App.Text>
          </App.Flex>

          <App.Flex center width={24} height={24} sx={{ cursor: 'pointer' }} onClick={handleClose}>
            <App.Icon icon="cross" color="#fff" />
          </App.Flex>
        </App.Flex>

        <App.Text size={18} weight={600} height={1}>{t('Here are')} <App.Text inline size={18} weight={600} height={1} color="#A6DC37">{t('Top 2 ways to Earn Gems:')}</App.Text></App.Text>

        <App.Flex column fullWidth gap={16}>
          <App.Flex column gap={16} className={styles.box}>
            <App.Flex row align="center" justify="space-between">
              <App.Text size={16} weight={600} height={1}>1. {t('Trade on Tegro')}</App.Text>
              <App.Text size={16} weight={600} height={1} color="#A6DC37">{t('Unlimited')}</App.Text>
            </App.Flex>

            <App.Text size={16} weight={400} color="#FFFFFF99">{t('Earn gems by trading on Tegro. You get x point for every trade you place. Get bonus gems using multipliers if you maintain a trading streak.')}</App.Text>

            <App.Button primary2 fullWidth onClick={handleExchange}>{t('Trade Now')}</App.Button>
          </App.Flex>

          <App.Flex column gap={16} className={styles.box}>
            <App.Flex row align="center" justify="space-between">
              <App.Text size={16} weight={600} height={1}>2. {t('Tweet about Tegro Auctions')}</App.Text>
              <App.Text size={16} weight={600} height={1} color="#A6DC37">50 {t('Gems')}</App.Text>
            </App.Flex>

            <App.Text size={16} weight={400} color="#FFFFFF99">{t('Let your friends know about this steal, and win gems in return.')}</App.Text>

            <App.Button primary2 fullWidth onClick={handleShare}>{t('Tweet Now')}</App.Button>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Dialog>
  )
}

export default AuctionWarning