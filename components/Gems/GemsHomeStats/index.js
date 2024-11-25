import { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import $gem from '@/store/gem'

import GemsSteps from '@/components/Gems/GemsSteps'

import App from '@/components/App'

import styles from './styles.module.scss'

const GemsHomeStats = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const statsLoading = useSelector(({ $gem }) => $gem.statsLoading)
  const stats = useSelector(({ $gem }) => $gem.stats)

  const handleExchange = () => {
    router.push('/exchange')
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Your stats breakdown')}</App.Text>

      {statsLoading ? (
        <App.LoaderBlock height={110} />
      ) : (
        <App.Flex direction={['row', 'column']} gap={24}>
          <App.Flex direction={['row', 'column']} flex={1} className={styles.gems}>
            <App.Flex width={[200, 'auto']} column gap={10} align="center" className={styles.box}>
              <App.Text center size={[16, 12]} weight={[600, 400]} height={1}>{t('Total gems')}</App.Text>
              <App.Text center size={[24, 20]} weight={600} height={1}>{stats.total_points ?? 0}</App.Text>
            </App.Flex>

            <App.Flex row wrap={isMobile} flex={[1, null]}>
              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Liquidity mining')}</App.Text>
                <App.Text center size={[24, 24]} weight={600} height={1}>{stats.liquidity_mining ?? 0}</App.Text>
              </App.Flex>

              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Refer & earn')}</App.Text>
                <App.Text center size={[24, 24]} weight={600} height={1}>{stats.refer ?? 0}</App.Text>
              </App.Flex>

              {/* <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Contributor tasks')}</App.Text>
                <App.Text center size={[24, 24]} weight={600} height={1}>{stats.contributor ?? 0}</App.Text>
              </App.Flex> */}

              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Side quests')}</App.Text>
                <App.Text center size={[24, 24]} weight={600} height={1}>{stats.quest ?? 0}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex width={280} row gap={24}>
            {/* <App.Flex width={[180, 'auto']} flex={[null, 1]} column gap={8} align="center" className={styles.box}>
              <App.Text center size={[14, 12]} weight={600} height={1}>{t('Your Gems Share')}</App.Text>
              <App.Text center size={[32, 24]} weight={600} height={1}>{stats.points_percentage}%</App.Text>
              <App.Text center size={12} weight={400} height={1}>{t('Your Gems ÷ Total Gems')}</App.Text>
            </App.Flex>

            <App.Flex width={[180, 'auto']} flex={[null, 1]} column align="center" justify="space-between" className={styles.box}>
              <App.Text center size={[14, 12]} weight={600} height={1}>{t('Live Earnings')}</App.Text>
              <App.Text center size={[32, 24]} weight={600} height={1}>{stats.points_pool} <App.Text center inline size={[16, 12]} weight={600} height={1}>USDT</App.Text></App.Text>
              <App.Text center size={12} weight={400} height={1}>{t('Yours Share × Total Drop')}</App.Text>
            </App.Flex> */}
          </App.Flex>
        </App.Flex>
      )}

      <GemsSteps full />

      <App.Button primary2 onClick={handleExchange} sx={{width: 155}}>{t('Get Started')} <App.Icon icon="arrow-45" /></App.Button>
    </App.Flex>
  )
}

export default GemsHomeStats