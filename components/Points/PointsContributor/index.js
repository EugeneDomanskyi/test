import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { QuestWidget } from '@bandit-network/quest-widget'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsContributor = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const tasks = useSelector(({ $point }) => $point.tasks)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wallet) {
      fetchTasks()
    }
  }, [wallet])

  const fetchTasks = async () => {
    const result = await $point.api.tasks(wallet, {})
    if (result?.data) {
      console.log(result.data)
      dispatch($point.set.tasks(result.data))
    }
    setLoading(false)
  }

  const handleVisit = (item) => () => {

  }

  const handleClaim = (id) => async () => {
    const result = await $point.api.taskClaim(wallet, { task_id: id })
    if (result && result?.data) {
      fetchTasks()
    }
  }

  return (
    <App.Flex column fullWidth gap={40}>
      <App.Flex fullWidth column gap={12}>
        <App.Text size={24} weight={700}>{t('Join the Tegro Tribe!')}</App.Text>
        <App.Text color="#9B99AE">{t('Be more than a trader; become a Tegro insider. Complete these simple steps, join our vibrant community, and boost your points balance along the way.')}</App.Text>
      </App.Flex>

      <App.Flex className="widget">
        <QuestWidget
          isOpen={true}
          dialog={false}
          collectionId={1}
          mode="quest_only"
          showLeaderBoard={false}
          showParticipants={false}
        />
      </App.Flex>

      {/* <App.Flex column gap={16}>
        {loading ? (
          <App.LoaderBlock height={300} />
        ) : (
          tasks.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {index > 0 ? <div className={styles.line} /> : null}

                <App.Flex row align="center" justify="space-between">
                  <App.Flex row align="center" gap={32} width={[500, 'auto']}>
                    <App.Flex center width={[44, 34]} height={[44, 34]} className={styles.frame}>
                      <App.Text size={[16, 14]} weight={[700, 600]} color="#A6DC37">{index + 1}</App.Text>
                    </App.Flex>

                    <App.Text size={16} weight={600}>{item.name}</App.Text>
                  </App.Flex>

                  <App.Text weight={600}>{item.points} points</App.Text>

                  {item.can_claim ? (
                    item.claimed ? (
                      isMobile ? (
                        <App.Flex center width={34} height={34} className={styles.claimed}>
                          <App.Icon icon="check" width={12} height={12} color="#9B99AE" />
                        </App.Flex>
                      ) : (
                        <App.Flex center width={160} height={40} className={styles.claimed}>
                          <App.Text color="#9B99AE">{t('Claimed')}</App.Text>
                        </App.Flex>
                      )
                    ) : (
                      isMobile ? (
                        <App.Frame padding={0} radius={34} width={34} height={34} sx={{ cursor: 'pointer' }} onClick={handleClaim(item.id)} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                          <App.Flex full center>
                            <App.Icon icon="check" width={12} height={12} />
                          </App.Flex>
                        </App.Frame>
                      ) : (
                        <App.ButtonGradient width={160} onClick={handleClaim(item.id)}>{t('Claim')}</App.ButtonGradient>
                      )
                    )
                  ) : (
                    isMobile ? (
                      <App.Frame padding={0} radius={34} width={34} height={34} sx={{ cursor: 'pointer' }} onClick={handleVisit(item)} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                        <App.Flex full center>
                          <App.Icon icon="arrow-45" width={12} height={12} />
                        </App.Flex>
                      </App.Frame>
                    ) : (
                      <App.ButtonGradient width={160} onClick={handleVisit(item)}>{t('Visit')}</App.ButtonGradient>
                    )
                  )}
                </App.Flex>
              </React.Fragment>
            )
          })
        )}
      </App.Flex> */}
    </App.Flex>
  )
}

export default PointsContributor