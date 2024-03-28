import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsQuests = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const quests = useSelector(({ $point }) => $point.quests)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wallet) {
      fetchQuests()
    }
  }, [wallet])

  const fetchQuests = async () => {
    const result = await $point.api.quests(wallet, {})
    if (result?.data) {
      dispatch($point.set.quests(result.data))
    }
    setLoading(false)
  }

  const handleClick = (url) => () => {
    window.open(url ?? 'https://galxe.com/', '_blank')
  }

  const handleClaim = (id) => async () => {
    const result = await $point.api.questClaim(wallet, { quest_id: id })
    if (result && result?.data) {
      fetchQuests()
    }
  }

  return (
    <App.Flex column fullWidth gap={40}>
      <App.Flex fullWidth column gap={12}>
        <App.Text size={24} weight={700}>{t('Venture Through Partner Portals')}</App.Text>
        <App.Text color="#9B99AE">{t('Engage with Tegro quests on platforms like Galxe, TaskOn, and more. Complete tasks, show your prowess, and rack up points across the Tegrosphere.')}</App.Text>
      </App.Flex>

      <App.Flex row wrap gap={30}>
        {loading ? (
          <App.LoaderBlock height={300} />
        ) : (
          quests.map(item => {
            return (
              <App.Flex key={item.id} column gap={16} className={styles.questBox}>
                <Image src="/images/points/points-galxe-logo.png" width={44} height={44} alt="" />

                <App.Flex row align="center" gap={12} sx={{ cursor: 'pointer' }} onClick={handleClick(item?.url)}>
                  <App.Text size={24} weight={700}>{item.name}</App.Text>

                  <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                    <App.Flex full center>
                      <App.Icon icon="arrow-45" width={16} height={16} />
                    </App.Flex>
                  </App.Frame>
                </App.Flex>

                <div className={styles.line} />

                <App.Flex row align="center" justify="space-between">
                  {item.can_claim ? (
                    item.claimed ? (
                      <App.Flex center width={160} height={40} className={styles.claimed}>
                        <App.Text color="#9B99AE">{t('Claimed')}</App.Text>
                      </App.Flex>
                    ) : (
                      <App.ButtonGradient width={160} onClick={handleClaim(item.id)}>{t('Claim')}</App.ButtonGradient>
                    )
                  ) : (
                    <App.Text color="#FFFFFF99">{t('Rewards')}</App.Text>
                  )}

                  <App.Flex row align="center" gap={8}>
                    <App.Text size={24} weight={700}>{item.points}</App.Text>
                    <App.Text italic size={16} weight={700} family="Playfair Display">{t('Points')}</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            )
          })
        )}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsQuests