import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $alert from '@/store/alert'
import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'

const GemsQuests = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const quests = useSelector(({ $gem }) => $gem.quests)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisible)

    if (wallet) {
      fetchQuests()
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [wallet])

  const fetchQuests = async () => {
    const result = await $gem.api.quests(wallet, {})
    if (result?.data) {
      dispatch($gem.set.quests(result.data))
    }
    setLoading(false)
  }

  const handleVisible = () => {
    if (!document.hidden) {
      fetchQuests()
    }
  }

  const handleClick = (url) => () => {
    if (url) {
      window.open(url ?? 'https://galxe.com/', '_blank')
    }
  }

  const handleClaim = (id, gems) => async (e) => {
    e.stopPropagation()
    const result = await $gem.api.questClaim(wallet, { quest_id: id })
    if (result && result?.data) {
      dispatch($alert.set.success({ title: 'Congratulations!', text: `${gems} gems credited` }))
      fetchQuests()
    }
  }

  return (
    <App.Flex fullWidth column className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex fullWidth column gap={16}>
            <App.Text size={[24, 20]} weight={600} height={1}>{t('Bonus side quests await!')}</App.Text>
            <App.Text size={[16, 14]} weight={400} height={1.4} color="#9B99AE">{t('Embark on exciting side quests across platforms like Galxe, TaskOn, and QuestN to discover special campaigns and unlock additional gems.')}</App.Text>
          </App.Flex>

          <App.Flex row wrap gap={24}>
            {loading ? (
              <App.LoaderBlock height={300} />
            ) : (
              quests.map(item => {
                return (
                  <App.Flex key={item.id} column gap={16} sx={{ cursor: item.can_claim ? 'default' : 'pointer' }} className={styles.questBox} onClick={handleClick(item.can_claim ? null : item?.external_link)}>
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
                        <App.Text size={[24, 20]} weight={600} height={1}>{item.points} {t('Gems')}</App.Text>
                      </App.Flex>

                      {item.can_claim ? (
                        item.claimed ? (
                          <App.Flex center width={160} height={48} className={styles.claimed}>
                            <App.Text size={16} weight={600} height={1} color="#9B99AE">{t('Claimed')}</App.Text>
                          </App.Flex>
                        ) : (
                          <App.Button primary2 variant="quest" sx={{width: 160}} onClick={handleClaim(item.id, item.points)}>{t('Claim')}</App.Button>
                        )
                      ) : (
                        <App.Flex center width={160} height={48} className={styles.claimed}>
                          <App.Text size={16} weight={600} height={1} color="#9B99AE">{t('Claim')}</App.Text>
                        </App.Flex>
                      )}
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

export default GemsQuests