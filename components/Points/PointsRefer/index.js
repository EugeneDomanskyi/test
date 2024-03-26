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
import PointsProgressCircle from '@/components/Points/PointsProgressCircle'

import styles from './styles.module.scss'

const PointsRefer = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $point }) => $point.referral)
  const history = useSelector(({ $point }) => $point.history)

  const [points, setPoints] = useState(50)
  const [hasReferrals, setHasReferrals] = useState(false)

  const link = `https://tegro.com?referral=${referral.referral_code}`

  const marks = [...new Array(21)].map((_, i) => {
    const isNum = !(i % 5)
    return {
      value: i * 5,
      label: isNum ? i * 5 : `•`,
    }
  })

  useEffect(() => {
    if (wallet) {
      fetchHistory()
    }
  }, [wallet])

  const fetchHistory = async () => {
    const result = await $point.api.history(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.history(result.data))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    dispatch($alert.set.success({ title: t('Code Copied'), text: t('The referral code has been successfully copied to clipboard') }))
  }

  const handleInvite = () => {
    console.log('Invite')
    setHasReferrals(!hasReferrals)
  }

  const handleChangeRange = (value) => {
    setPoints(value)
  }

  const handleShare = () => {
    console.log('Share')
  }

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex column fullWidth gap={40}>
      {referral.referrals_count > 0 ? (
        <App.Flex direction={['row', 'column']} fullWidth gap={24}>
          <App.Flex column flex={[45, null]} className={cn(styles.box, styles.nopadding)}>
            <App.Flex row gap={[0, 16]} height={[320, 'auto']} fullWidth className={styles.chartBack}>
              <App.Flex center fullHeight width={240} className={styles.relative}>
                <PointsProgressCircle progress={referral.referrals_count} />
              </App.Flex>

              <App.Flex column gap={16} justify="space-between" width={['auto', '100%']} sx={{ padding: '32px 16px' }}>
                <App.Flex column gap={24}>
                  <App.Flex column gap={8}>
                    <App.Text size={28} weight={700}>{t('Overall')} <App.Text inline italic size={28} weight={700} family="Playfair Display" color="#A6DC37">{t('Statistics')}</App.Text></App.Text>
                    <App.Text>{t('Points earned via referral')}</App.Text>
                  </App.Flex>

                  {isMobile ? (
                    <App.Flex center fullWidth className={styles.relativeM}>
                      <PointsProgressCircle progress={referral.referrals_count} />
                    </App.Flex>
                  ) : null}

                  <div className={styles.line} />

                  <App.Flex row align="center" fullWidth justify={['flex-start', 'space-between']} gap={16}>
                    <App.Text color="#FFFFFF99">{t('Lifetime Earnings')}</App.Text>

                    <App.Flex column center gap={4}>
                      <App.Text size={32} weight={600} height={1}>{referral.points_referral}</App.Text>
                      <App.Text color="#FFFFFF99">{t('Points')}</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>

                <App.ButtonGradient large onClick={handleShare}>{t('Share Now')}</App.ButtonGradient>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column flex={[55, null]} gap={24} height={['auto', 480]} className={styles.box}>
            <App.Flex row align="center" justify="space-between" gap={16}>
              <App.Text size={24} weight={700}>{t('My')} <App.Text inline italic size={24} weight={700} family="Playfair Display">{t('Referrals')}</App.Text></App.Text>

              <App.Flex row gap={16} align="center">
                {!isMobile ? (
                  <App.Text center size={14} weight={600} color="#7E91F1"><Link href="/points-dashboard/referral-history">{t('View Full Transactions History')} &gt;</Link></App.Text>
                ) : null}

                <App.Text center size={14} weight={600} color="#7E91F1"><Link href="/points-dashboard/faq">{t('Read FAQ')} &gt;</Link></App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Flex row justify="flex-start" align="center" flex={[1, 2]}>
                <App.Text left weight={600} color="#7E91F1">{t('Wallet')}</App.Text>
              </App.Flex>

              <App.Flex row center flex={1}>
                <App.Text center weight={600} color="#7E91F1">{t('Status')}</App.Text>
              </App.Flex>

              <App.Flex row justify="flex-end" align="center" flex={1} sx={{ paddingRight: 10 }}>
                <App.Text right weight={600} color="#7E91F1">{t('Reward')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column flex={1} fullWidth className={styles.scroll}>
              <App.Flex column gap={12} className={styles.table}>
                <div className={styles.line} />

                {history.map(item => {
                  return (
                    <React.Fragment key={item.id}>
                      <App.Flex row align="center" justify="space-between">
                        <App.Flex column gap={8} flex={[1, 2]}>
                          <App.Text weight={600} height={1}>{getShort(item.referral_user.wallet_address)}</App.Text>
                          <App.Text color="#9B99AE" height={1}>{moment(item.created_at).format('DD.MM.YY')}</App.Text>
                        </App.Flex>

                        <App.Flex row center flex={1}>
                          <App.Flex center className={cn(styles.status, styles.trade)}>
                            <App.Text center uppercase size={12} weight={700}>{t(item.reason)}</App.Text>
                          </App.Flex>
                        </App.Flex>

                        <App.Flex row justify="flex-end" align="center" flex={1} sx={{ paddingRight: 10 }}>
                          <App.Text right italic size={16} weight={700} family="Playfair Display">{t(isMobile ? '${{amount}}' : '{{amount}} points', {amount: item.points})}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <div className={styles.line} />
                    </React.Fragment>
                  )
                })}
              </App.Flex>
            </App.Flex>

            {isMobile ? (
              <App.Text size={14} weight={600} color="#7E91F1"><Link href="/points-dashboard/referral-history">{t('View Full Transactions History')} &gt;</Link></App.Text>
            ) : null}
          </App.Flex>
        </App.Flex>
      ) : (
        <App.Flex direction={['row', 'column']} fullWidth gap={24}>
          <App.Flex column flex={55} gap={32} className={styles.box}>
            <App.Flex column gap={12}>
              <App.Text size={28} weight={700}>{t('Overall')} <App.Text inline italic size={28} weight={700} family="Playfair Display" color="#A6DC37">{t('Statistics')}</App.Text></App.Text>
              <App.Text>{t('Based on average trading amount')}</App.Text>
            </App.Flex>

            <App.RangeInput
              value={points}
              max={100}
              step={5}
              onChange={handleChangeRange}
              marks={marks}
            />

            <div className={styles.line} />

            <App.Flex row fullWidth align="center" justify="space-between">
              <App.Text color="#FFFFFF99">{t('Rewards')}</App.Text>
              <App.Text size={32} weight={700}>{points * 25} <App.Text inline italic size={16} weight={700} family="Playfair Display">{t('Points')}</App.Text></App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column justify="space-between" flex={45} gap={8}>
            <App.Flex className={cn(styles.box, styles.nopadding)}>
              <App.Flex column justify="center" height={['auto', 113]} gap={8} className={styles.step1}>
                <App.Text italic size={12} weight={700} family="Playfair Display" color="#A6DC37">{t('Step {{number}}', {number: 1})}</App.Text>
                <App.Text size={17} weight={600}>{t('Share your Unique Link')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex className={cn(styles.box, styles.nopadding)}>
              <App.Flex column justify="center" height={['auto', 113]} gap={8} className={styles.step2}>
                <App.Text italic size={12} weight={700} family="Playfair Display" color="#A6DC37">{t('Step {{number}}', {number: 2})}</App.Text>
                <App.Text size={17} weight={600}>{t('Your Friend Signs Up & Trades')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex className={cn(styles.box, styles.nopadding)}>
              <App.Flex column justify="center" height={['auto', 113]} gap={8} className={styles.step3}>
                <App.Text italic size={12} weight={700} family="Playfair Display" color="#A6DC37">{t('Step {{number}}', {number: 3})}</App.Text>
                <App.Text size={17} weight={600}>{t('Earn Points Every Time They Trade')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Text color="#9B99AE">{t('Still have questions?')}</App.Text>

              <Link href="/points-dashboard/faq">
                <App.Text weight={600} color="#7E91F1">{t('Read FAQ >')}</App.Text>
              </Link>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      )}

      <div className={styles.line} />

      <App.Flex direction={['row', 'column']} fullWidth align="center" justify="space-between" gap={16}>
        <App.Flex>
          <App.Text size={24} weight={700}>{t('Unleash the power of community! Earn up to $100k Points with every referral!')}</App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} center gap={20} width={['auto', '100%']}>
          <App.Flex align="center" justify="space-between" gap={16} width={[384, '100%']} className={styles.code}>
            <App.Text color="#9B99AE">{link}</App.Text>
            <App.Icon icon="copy" color="#9281C5" style={{ cursor: 'pointer' }} onClick={handleCopy} />
          </App.Flex>

          <App.ButtonGradient large width={['auto', '100%']} onClick={handleInvite}>{t('Invite Friends on X')}</App.ButtonGradient>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsRefer