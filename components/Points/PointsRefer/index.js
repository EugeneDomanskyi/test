import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import cn from 'classnames'
import moment from 'moment'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'
import $alert from '@/store/alert'

import App from '@/components/App'
import PointsSlider from '@/components/Points/PointsSlider'
import PointsReferHistory from '@/components/Points/PointsReferHistory'

import styles from './styles.module.scss'

const PointsRefer = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $point }) => $point.referral)
  const history = useSelector(({ $point }) => $point.history)

  const [points, setPoints] = useState(1)
  const [values, setValues] = useState({ my: 250, his: 1000 })
  const [hasReferrals, setHasReferrals] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pointsToday, setPointsToday] = useState(0)

  const marks = [
    { value: 0, label: 0 },
    { value: 1, label: 1000 },
    { value: 2, label: 2000 },
    { value: 3, label: 5000 },
    { value: 4, label: 7500 },
    { value: 5, label: 10000 },
  ]

  useEffect(() => {
    if (wallet) {
      fetchInfo()
    }
  }, [wallet])

  const fetchInfo = async () => {
    const calls = [
      fetchReferral(),
      fetchHistory(),
    ]

    await Promise.all(calls)
    setLoading(false)
  }

  const fetchReferral = async () => {
    const result = await $point.api.referral(wallet)
    if (result && result?.data) {
      dispatch($point.set.referral(result?.data))
    }
  }

  const fetchHistory = async () => {
    const result = await $point.api.history(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.history(result.data))
      setPointsToday(result.data.filter(item => moment(item.created_at).isSame(new Date(), 'day')).reduce((acc, item) => acc + item.points, 0))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}?referral=${referral.referral_code}`)
    dispatch($alert.set.success({ title: t('Link copied to clipboard') }))
  }

  const handleInvite = () => {
    console.log('Invite')
    setHasReferrals(!hasReferrals)
  }

  const handleChangeRange = (value) => {
    setPoints(value)

    const current = marks.find(item => item.value === value)
    if (current) {
      setValues({ my: current.label * 0.25, his: current.label })
    }
  }

  const handleShare = () => {
    const link = `${window.location.origin}?referral=${referral.referral_code}`
    const tweetText = encodeURIComponent(`
I'm getting 💸 pre-rich with Tegro! 🐅 Simply open an order to begin farming ✨POINTS!✨
Sign up with my link today to get started! ✅${link}
Don't fade on this gem💎
`)
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')
  }

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex column fullWidth gap={32} className={styles.container}>
      {loading ? (
        <App.LoaderBlock height={200} />
      ) : (
        referral.referrals_count > 0 ? (
          <App.Flex column gap={32}>
            <App.Container maxWidth={1230}>
              <App.Flex direction={['row', 'column']} gap={24}>
                <App.Flex column gap={[12, 20]} flex={[65, null]} className={styles.topBox}>
                  <App.Text size={[24, 20]} weight={600}>{t('Refer & Earn Stats')}</App.Text>

                  <App.Flex row wrap={isMobile} gap={[24, 20]}>
                    <App.Flex width={['auto', '100%']} flex={[1, null]} center column gap={8} className={styles.insideBox}>
                      <App.Text size={[14, 12]} weight={400} height={1}>{t('Referrals')}</App.Text>
                      {loading ? (
                        <App.Loader size={[32, 24]} />
                      ) : (
                        <App.Text size={[32, 24]} weight={600} height={1}>{referral.referrals_count}</App.Text>
                      )}
                    </App.Flex>

                    <App.Flex width={['auto', '100%']} flex={[1, null]} center column gap={8} className={styles.insideBox}>
                      <App.Text size={[14, 12]} weight={400} height={1}>{t('Referral Points')}</App.Text>
                      {loading ? (
                        <App.Loader size={[32, 24]} />
                      ) : (
                        <App.Text size={[32, 24]} weight={600} height={1}>{referral.points_referral}</App.Text>
                      )}
                    </App.Flex>

                    {/* <App.Flex width={['auto', 'calc(50% - 12px)']} order={[3, 2]} flex={[1, null]} center column gap={8} className={styles.insideBox}>
                      <App.Text size={[14, 12]} weight={400} height={1}>{t('Points Earned')}</App.Text>
                      {loading ? (
                        <App.Loader size={[32, 24]} />
                      ) : (
                        <App.Text size={[32, 24]} weight={600} height={1}>{pointsToday}</App.Text>
                      )}
                    </App.Flex> */}
                  </App.Flex>
                </App.Flex>

                <App.Flex column justify="space-between" gap={[0, 24]} flex={[35, null]} className={styles.topBox}>
                  <App.Flex column gap={8}>
                    <App.Text size={[24, 16]} weight={600} height={1}>{t('Unleash the power of community!')}</App.Text>
                    <App.Text size={[24, 16]} weight={600} height={1}>{t('Earn')} <App.Text inline size={[24, 16]} weight={600} height={1} color="#A6DC37">{t('25% Points')}</App.Text> {t('of')} <App.Text inline size={[24, 16]} weight={600} height={1} color="#A6DC37">{t('Every referral!')}</App.Text></App.Text>
                  </App.Flex>

                  <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="center" gap={24}>
                    <App.Flex row flex={[1, null]} align="center" justify="space-between" className={styles.copyAddress} onClick={handleCopy}>
                      <App.Text color="#FFFFFF99">{referral.referral_code}</App.Text>
                      <App.Icon icon="copy" color="#FFFFFF99" />
                    </App.Flex>
                    <App.Button primary2 onClick={handleShare}>{t('Share on X')}</App.Button>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Container>

            <div className={styles.line} />

            <App.Container maxWidth={1230}>
              <PointsReferHistory />
            </App.Container>
          </App.Flex>
        ) : (
          <App.Container maxWidth={1230}>
            <App.Flex column gap={32}>
              <App.Flex direction={['row', 'column']} gap={24}>
                <App.Flex column flex={1} gap={24}>
                  <App.Text size={[32, 20]} weight={600} height={1}>{t('Refer & Earn')}</App.Text>

                  <App.Flex column>
                    <App.Text size={[24, 16]} weight={600}>{t('Unleash the power of community!')}</App.Text>
                    <App.Text size={[24, 16]} weight={600}>{t('Earn')} <App.Text inline size={[24, 16]} weight={600} color="#A6DC37">{t('25% Points')}</App.Text> {t('of')} <App.Text inline size={[24, 16]} weight={600} color="#A6DC37">{t('Every referral!')}</App.Text></App.Text>
                  </App.Flex>

                  <App.Flex column gap={12}>
                    <App.Flex row align="center" width={[384, 'auto']} justify="space-between" className={styles.copyAddress} onClick={handleCopy}>
                      <App.Text color="#FFFFFF99">{referral.referral_code}</App.Text>
                      <App.Icon icon="copy" color="#FFFFFF99" />
                    </App.Flex>
                    <App.Button primary2 onClick={handleShare}>{t('Share on X')}</App.Button>
                  </App.Flex>
                </App.Flex>

                <App.Flex className={styles.overall} column gap={16}>
                  <App.Flex center className={styles.overallBox}>
                    <App.Text size={14} weight={400}>{t('Earn')} <b>{values.my}</b> {t('points when your friend earns')} <b>{values.his}</b>!</App.Text>
                  </App.Flex>

                  <App.Flex column className={styles.overallSlider}>
                    <App.Flex flex={1}>
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                    </App.Flex>

                    <PointsSlider
                      value={points}
                      max={5}
                      step={1}
                      marks={marks}
                      onChange={handleChangeRange}
                    />

                    <App.Flex flex={1} sx={{ position: 'relative' }}>
                      <App.Flex className={styles.glow}>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={points >= 0 ? '#FFFFFF' : '#5E5C6B'}>0</App.Text>
                          <App.Text size={12} weight={400} height={1} color={points >= 0 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Points')}</App.Text>
                        </App.Flex>
                      </App.Flex>
                      
                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={points >= 1 ? '#FFFFFF' : '#5E5C6B'}>1000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={points >= 1? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Points')}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={points >= 2 ? '#FFFFFF' : '#5E5C6B'}>2000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={points >= 2 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Points')}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={points >= 3 ? '#FFFFFF' : '#5E5C6B'}>5000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={points >= 3 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Points')}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={points >= 4 ? '#FFFFFF' : '#5E5C6B'}>7500</App.Text>
                          <App.Text size={12} weight={400} height={1} color={points >= 4 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Points')}</App.Text>
                        </App.Flex>

                        <App.Flex column center gap={4} className={styles.textLast}>
                          <App.Text size={12} weight={400} height={1} color={points >= 5 ? '#FFFFFF' : '#5E5C6B'}>10000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={points >= 5 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Points')}</App.Text>
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={16}>
                <App.Flex direction={['row', 'column']} gap={24}>
                  <App.Flex column flex={1} gap={8} className={cn(styles.box, styles.box1)}>
                    <App.Text weifht={600} height={1} color="#A6DC37">{t('Step {{n}}', {n: 1})}</App.Text>
                    <App.Text size={20} weifht={600} height={1}>{t('Share Your Unique Link')}</App.Text>
                  </App.Flex>

                  <App.Flex column flex={1} gap={8} className={cn(styles.box, styles.box2)}>
                    <App.Text weifht={600} height={1} color="#A6DC37">{t('Step {{n}}', {n: 2})}</App.Text>
                    <App.Text size={20} weifht={600} height={1}>{t('Your Friend Signs Up')}</App.Text>
                  </App.Flex>

                  <App.Flex column flex={1} gap={8} className={cn(styles.box, styles.box3)}>
                    <App.Text weifht={600} height={1} color="#A6DC37">{t('Step {{n}}', {n: 3})}</App.Text>
                    <App.Text size={20} weifht={600} height={1.2}>{t('Earn 25% of Every Point They Earn')}</App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex row gap={8} align="center" justify="flex-end">
                  <App.Text weight={600} height={1} color="#737373">{t('Still have questions?')}</App.Text>
                  <App.Text weight={600} height={1} color="#7A5EF4"><Link href="/points-dashboard/faq">{t('Read FAQ >')}</Link></App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Container>
        )
      )}
    </App.Flex>
  )
}

export default PointsRefer