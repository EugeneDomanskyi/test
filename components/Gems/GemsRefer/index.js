import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'
import $alert from '@/store/alert'

import App from '@/components/App'
import GemsSlider from '@/components/Gems/GemsSlider'
import GemsReferHistory from '@/components/Gems/GemsReferHistory'

import styles from './styles.module.scss'

const GemsRefer = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $gem }) => $gem.referral)

  const [gems, setGems] = useState(1)
  const [values, setValues] = useState({ my: 250, his: 1000 })
  const [loading, setLoading] = useState(true)

  const marks = [
    { value: 0, label: 0 },
    { value: 1, label: 1000 },
    { value: 2, label: 2000 },
    { value: 3, label: 5000 },
    { value: 4, label: 7500 },
    { value: 5, label: 10000 },
  ]

  useEffect(() => {
    fetchInfo()
  }, [wallet])

  const fetchInfo = async () => {
    const calls = [
      fetchReferral(),
      fetchReferrals(),
    ]

    await Promise.all(calls)
    setLoading(false)
  }

  const fetchReferral = async () => {
    const result = await $gem.api.referral(wallet ?? '0xF1f8ed0a5F170c0fFedf165912478A66f28aAe00')
    if (result) {
      dispatch($gem.set.referral(result))
    }
  }

  const fetchReferrals = async () => {
    const result = await $gem.api.referrals(wallet ?? '0xF1f8ed0a5F170c0fFedf165912478A66f28aAe00', {})
    if (result) {
      dispatch($gem.set.referrals(result))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}?referral=${referral.referral_code}`)
    dispatch($alert.set.success({ title: t('Link copied to clipboard') }))
  }

  const handleChangeRange = (value) => {
    setGems(value)

    const current = marks.find(item => item.value === value)
    if (current) {
      setValues({ my: current.label * 0.25, his: current.label })
    }
  }

  const handleShare = () => {
    const link = `${window.location.origin}?referral=${referral.referral_code}`
    const tweetText = encodeURIComponent(`
I'm getting 💸 pre-rich with Tegro! 🐅 Simply open an order to begin farming ✨GEMS!✨
Sign up with my link today to get started! ✅${link}
Don't fade on this gem💎
`)
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')
  }

  return (
    <App.Flex column fullWidth gap={32} className={styles.container}>
      {loading ? (
        <App.LoaderBlock height={200} />
      ) : (
        referral.id > 0 && referral.referrals_count > 0 ? (
          <App.Flex column gap={32}>
            <App.Container maxWidth={1230}>
              <App.Flex direction={['row', 'column']} gap={24}>
                <App.Flex column gap={[12, 20]} flex={[65, null]} className={styles.topBox}>
                  <App.Text size={[24, 20]} weight={600}>{t('Referral gems tracker')}</App.Text>

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
                      <App.Text size={[14, 12]} weight={400} height={1}>{t('Referral Gems')}</App.Text>
                      {loading ? (
                        <App.Loader size={[32, 24]} />
                      ) : (
                        <App.Text size={[32, 24]} weight={600} height={1}>{referral.points_referral}</App.Text>
                      )}
                    </App.Flex>
                  </App.Flex>
                </App.Flex>

                <App.Flex column justify="space-between" gap={[0, 24]} flex={[35, null]} className={styles.topBox}>
                  <App.Flex column gap={8}>
                    <App.Text size={[24, 16]} weight={600} height={1.2}><s>{t('Apes')}</s> {t('Tigers together strong! Refer your friends to earn')} <App.Text inline size={[24, 16]} weight={600} height={1} color="#A6DC37">{t('25% of their gems')}</App.Text></App.Text>
                  </App.Flex>

                  <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="center" gap={24}>
                    <App.Flex row flex={[1, null]} align="center" justify="space-between" className={styles.copyAddress} onClick={handleCopy}>
                      <App.Text color="#FFFFFF99">{referral.referral_code}</App.Text>
                      <App.Icon icon="copy" color="#FFFFFF99" />
                    </App.Flex>
                    <App.Button primary2 onClick={handleShare}>
                      {t('Share on X')}
                      <App.Icon icon="arrow-45" />
                    </App.Button>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Container>

            <div className={styles.line} />

            <App.Container maxWidth={1230}>
              <GemsReferHistory />
            </App.Container>
          </App.Flex>
        ) : (
          <App.Container maxWidth={1230}>
            <App.Flex column gap={32}>
              <App.Flex direction={['row', 'column']} gap={24}>
                <App.Flex column flex={1} gap={24}>
                  <App.Text size={[32, 20]} weight={600} height={1}>{t('Refer & Earn')}</App.Text>

                  <App.Flex column>
                    <App.Text size={[24, 16]} weight={600} height={1.2}><s>{t('Apes')}</s> {t('Tigers together strong! Refer your friends to earn')} <App.Text inline size={[24, 16]} weight={600} height={1} color="#A6DC37">{t('25% of their gems')}</App.Text></App.Text>
                  </App.Flex>

                  {referral.referral_code != '' ? (
                    <App.Flex column gap={12}>
                      <App.Flex row align="center" width={[384, 'auto']} justify="space-between" className={styles.copyAddress} onClick={handleCopy}>
                        <App.Text color="#FFFFFF99">{referral.referral_code}</App.Text>
                        <App.Icon icon="copy" color="#FFFFFF99" />
                      </App.Flex>
                      <App.Button primary2 onClick={handleShare}>
                        {t('Share on X')}
                        <App.Icon icon="arrow-45" />  
                      </App.Button>
                    </App.Flex>
                  ) : null}
                </App.Flex>

                <App.Flex className={styles.overall} column gap={16}>
                  <App.Flex center className={styles.overallBox}>
                    <App.Text size={14} weight={400}>{t('Earn')} <b>{values.my}</b> {t('gems when your friend earns')} <b>{values.his}</b>!</App.Text>
                  </App.Flex>

                  <App.Flex column className={styles.overallSlider}>
                    <App.Flex flex={1}>
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                      <App.Flex fullHeight flex={1} className={styles.dashedTop} />
                    </App.Flex>

                    <GemsSlider
                      value={gems}
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
                          <App.Text size={12} weight={400} height={1} color={gems >= 0 ? '#FFFFFF' : '#5E5C6B'}>0</App.Text>
                          <App.Text size={12} weight={400} height={1} color={gems >= 0 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Gems')}</App.Text>
                        </App.Flex>
                      </App.Flex>
                      
                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={gems >= 1 ? '#FFFFFF' : '#5E5C6B'}>1000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={gems >= 1? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Gems')}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={gems >= 2 ? '#FFFFFF' : '#5E5C6B'}>2000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={gems >= 2 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Gems')}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={gems >= 3 ? '#FFFFFF' : '#5E5C6B'}>5000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={gems >= 3 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Gems')}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex fullHeight flex={1} className={styles.dashedBottom}>
                        <App.Flex column center gap={4} className={styles.text}>
                          <App.Text size={12} weight={400} height={1} color={gems >= 4 ? '#FFFFFF' : '#5E5C6B'}>7500</App.Text>
                          <App.Text size={12} weight={400} height={1} color={gems >= 4 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Gems')}</App.Text>
                        </App.Flex>

                        <App.Flex column center gap={4} className={styles.textLast}>
                          <App.Text size={12} weight={400} height={1} color={gems >= 5 ? '#FFFFFF' : '#5E5C6B'}>10000</App.Text>
                          <App.Text size={12} weight={400} height={1} color={gems >= 5 ? '#FFFFFF' : '#5E5C6B'}>{t(isMobile ? 'RP' : 'Referee Gems')}</App.Text>
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
                    <App.Text size={20} weifht={600} height={1.2}>{t('Earn 25% of Every Gems They Earn')}</App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex row gap={8} align="center" justify="flex-end">
                  <App.Text weight={600} height={1} color="#737373">{t('Still have questions?')}</App.Text>
                  <App.Text weight={600} height={1} color="#7A5EF4"><Link href="/gems-dashboard/faq">{t('Read FAQ >')}</Link></App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Container>
        )
      )}
    </App.Flex>
  )
}

export default GemsRefer