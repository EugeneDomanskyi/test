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
    if (url) {
      window.open(url ?? 'https://galxe.com/', '_blank')
    }
  }

  const handleClaim = (id) => async () => {
    const result = await $point.api.questClaim(wallet, { quest_id: id })
    if (result && result?.data) {
      fetchQuests()
    }
  }

  return (
    <App.Flex fullWidth column className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex fullWidth column gap={16}>
            <App.Text size={[24, 20]} weight={600} height={1}>{t('Venture Through Partner Portals')}</App.Text>
            <App.Text size={[16, 14]} weight={400} height={1.4} color="#9B99AE">{t('Engage with Tegro quests on platforms like Galxe, TaskOn, and more. Complete tasks, show your prowess, and rack up points across the Tegrosphere.')}</App.Text>
          </App.Flex>

          <App.Flex row wrap gap={24}>
            {loading ? (
              <App.LoaderBlock height={300} />
            ) : (
              quests.map(item => {
                return (
                  <App.Flex key={item.id} column gap={16} sx={{ cursor: item.can_claim ? 'default' : 'pointer' }} className={styles.questBox} onClick={handleClick(item.can_claim ? null : item?.external_link)}>
                    <Image src="/images/points/points-galxe-logo.png" width={44} height={44} alt="" />

                    <App.Flex row align="center" gap={12}>
                      <App.Text size={[24, 20]} weight={600} height={1}>{item.name}</App.Text>

                      <App.Flex center className={styles.arrow}>
                        <App.Icon icon="arrow-45" width={16} height={16} />
                      </App.Flex>
                    </App.Flex>

                    <div className={styles.line} />

                    <App.Flex row align="center" justify="space-between">
                      <App.Flex column>
                        <App.Text color="#FFFFFF99">{t('Rewards')}</App.Text>
                        <App.Text size={[24, 20]} weight={600} height={1}>{item.points} {t('Points')}</App.Text>
                      </App.Flex>

                      {item.can_claim ? (
                        item.claimed ? (
                          <App.Flex center width={160} height={48} className={styles.claimed}>
                            <App.Text size={16} weight={600} height={1} color="#9B99AE">{t('Claimed')}</App.Text>
                          </App.Flex>
                        ) : (
                          <App.Button primary2 sx={{width: 160}} onClick={handleClaim(item.id)}>{t('Claim')}</App.Button>
                        )
                      ) : null}
                    </App.Flex>
                  </App.Flex>
                )
              })
            )}
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsQuests