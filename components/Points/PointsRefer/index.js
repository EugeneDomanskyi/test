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
    dispatch($alert.set.success({ title: t('Link copied to clipboard') }))
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
    <App.Flex column fullWidth gap={32} className={styles.container}>
      {hasReferrals ? (
        <App.Flex column gap={32}>
          <App.Container maxWidth={1230}>
            <App.Flex row gap={24}>
              <App.Flex column gap={12} flex={65} className={styles.topBox}>
                <App.Flex row justify="space-between">
                  <App.Text size={24} weight={600}>{t('Refer & Earn Stats')}</App.Text>

                  <App.Button primary2 onClick={handleShare}>{t('Share Now')} <App.Icon icon="arrow-45" /></App.Button>
                </App.Flex>

                <App.Flex row gap={24}>
                  <App.Flex flex={1} center column gap={8} className={styles.insideBox}>
                    <App.Text weight={400} height={1}>{t('Referrals')}</App.Text>
                    <App.Text size={32} weight={600} height={1}>5,431</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center column gap={8} className={styles.insideBox}>
                    <App.Text weight={400} height={1}>{t('Points Earned from Referral')}</App.Text>
                    <App.Text size={32} weight={600} height={1}>823</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center column gap={8} className={styles.insideBox}>
                    <App.Text weight={400} height={1}>{t('Points Earned Today')}</App.Text>
                    <App.Text size={32} weight={600} height={1}>46,431</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>

              <App.Flex column justify="space-between" flex={35} className={styles.topBox}>
                <App.Flex column gap={8}>
                  <App.Text size={24} weight={600} height={1}>{t('Unleash the power of community!')}</App.Text>
                  <App.Text size={24} weight={600} height={1}>{t('Earn')} <App.Text inline size={24} weight={600} height={1} color="#A6DC37">{t('25% Points')}</App.Text> {t('of')} <App.Text inline size={24} weight={600} height={1} color="#A6DC37">{t('Every referral!')}</App.Text></App.Text>
                </App.Flex>

                <App.Flex row center gap={24}>
                  <App.Flex row flex={1} align="center" justify="space-between" className={styles.copyAddress} onClick={handleCopy}>
                    <App.Text color="#FFFFFF99">uoipokkjg267yguidjnp</App.Text>
                    <App.Icon icon="copy" color="#FFFFFF99" />
                  </App.Flex>
                  <App.Button primary2 onClick={handleInvite}>{t('Invite Friends')}</App.Button>
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
            <App.Flex row gap={24}>
              <App.Flex column flex={1} gap={24}>
                <App.Text size={24} weight={600} height={1}>{t('Refer & Earn')}</App.Text>
                <App.Text size={20} weight={600}>{t('Unleash the power of community! Earn up to')} <App.Text inline size={20} weight={600} color="#A6DC37">{t('100k Points')}</App.Text> {t('with')} <App.Text inline size={20} weight={600} color="#A6DC37">{t('every referral!')}</App.Text></App.Text>
              </App.Flex>

              <App.Flex className={styles.overall} column gap={16}>
                <App.Text size={24} weight={600} height={1}>{t('Overall')} <App.Text inline size={24} weight={600} height={1} color="#A6DC37">{t('Statistics')}</App.Text></App.Text>

                <App.Flex className={styles.overallBox}>
                  <App.Text size={14} weight={400}>{t('Earn')} <b>250</b> {t('points when your friend earns')} <b>1000</b>!</App.Text>
                </App.Flex>

                <App.Flex sx={{ transform: 'rotate(-15deg)' }}>
                  <PointsSlider
                    value={points}
                    max={100}
                    step={5}
                    onChange={handleChangeRange}
                    marks={marks}
                  />
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex column gap={16}>
              <App.Flex row gap={24}>
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
      )}

      <div className={styles.line} />

      <App.Container maxWidth={1230}>
        <App.Flex row align="center" justify="space-between">
          <App.Flex column gap={8}>
            <App.Text size={24} weight={600} height={1}>{t('Unleash the power of community!')}</App.Text>
            <App.Text size={24} weight={600} height={1}>{t('Earn')} <App.Text inline size={24} weight={600} height={1} color="#A6DC37">{t('25% Points')}</App.Text> {t('of')} <App.Text inline size={24} weight={600} height={1} color="#A6DC37">{t('Every referral!')}</App.Text></App.Text>
          </App.Flex>

          <App.Flex row center gap={24}>
            <App.Flex row align="center" width={384} justify="space-between" className={styles.copyAddress} onClick={handleCopy}>
              <App.Text color="#FFFFFF99">uoipokkjg267yguidjnp</App.Text>
              <App.Icon icon="copy" color="#FFFFFF99" />
            </App.Flex>
            <App.Button primary2 onClick={handleInvite}>{t('Invite Friends with Unique Link')}</App.Button>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsRefer