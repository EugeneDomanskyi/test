import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'
import moment from 'moment'

import { usePropsHelper } from '@/myhooks/props-helper'

import $modal from '@/store/modal'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useEffect } from 'react'

const RaffleInfoModal = ({item}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { propValue } = usePropsHelper()

  const showModal = useSelector((state) => state.$modal.show)

  useEffect(() => {
    if (!showModal) {
      router.push('/raffle', undefined, { scroll: false })
    }
  }, [showModal])

  const handleClick = (item) => {
    dispatch($modal.set.show({modal: 'Raffle/RaffleClaimModal', props: {
      item: item,
      size: 'small',
      header: {
        steps: [
          {
            step: 0,
            title: 'Approve Contract',
          },
          {
            step: 1,
            title: 'Deposit TKeys',
          },
          {
            step: 2,
            title: 'Claim Mystery Box',
          },
        ],
      }
    }}))
  }

  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  return (
    <>
      <App.Flex column className={styles.top} justify="space-between" gap={16}>
        <App.Flex sx={{width: '100%'}} justify="space-between">
          <App.Flex row center gap={4} className={cn(styles.timeBadge, styles[item.status])}>
            <App.Flex center className={styles.dot} />
            <App.Text size={[12, 10]} height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text>
          </App.Flex>

          {item.status != 'closed' ? (
            <App.Flex row center gap={4} className={styles.tkeyBadge}>
              <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
              <App.Text size={[12, 10]} height={1}>{item.tKeyRequired} TKeys required to participate</App.Text>
            </App.Flex>
          ) : null}
        </App.Flex>

        <App.Flex justify="space-between">
          <App.Flex center sx={{ minWidth: propValue([65, 32], true) }} gap={16}>
            <Image src={item.image} width={propValue([48, 32], true)} height={propValue([48, 32], true)} alt="" />
            <App.Text size={20} weight={700}>{ item.title }</App.Text>
          </App.Flex>

          <App.Button sx={{borderRadius: 100}}>Share</App.Button>
        </App.Flex>
      </App.Flex>

      <App.Flex column gap={32} align="center" className={styles.content}>
        <App.Flex className={styles.titleBlock}>
          <Image src="/images/raffle/lootbox.png" width={49} height={45} alt="" />
          <App.Text center size={14} weight={500}>The potential value of USDT inside the case</App.Text>
        </App.Flex>

        <App.Flex gap={16} className={styles.rewardsContainer}>
          <App.Flex column align="center" className={styles.rewardBlock} gap={8}>
            <App.Flex gap={4}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text size={12} weight={400}>Mirco Reward</App.Text>
            </App.Flex>

            <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={26} weight={700}>$0.001</App.ShadowText>
            <App.Text size={14} weight={500}>Odds: 65%</App.Text>
          </App.Flex>
          
          <App.Flex column align="center" className={styles.rewardBlock} gap={8}>
            <App.Flex gap={4}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text size={12} weight={400}>Small Reward</App.Text>
            </App.Flex>

            <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={26} weight={700}>$0.01</App.ShadowText>
            <App.Text size={14} weight={500}>Odds: 20%</App.Text>
          </App.Flex>
          
          <App.Flex column align="center" className={styles.rewardBlock} gap={8}>
            <App.Flex gap={4}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text size={12} weight={400}>Medium Reward</App.Text>
            </App.Flex>

            <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={26} weight={700}>$1</App.ShadowText>
            <App.Text size={14} weight={500}>Odds: 10%</App.Text>
          </App.Flex>

          <App.Flex column align="center" className={styles.rewardBlock} gap={8}>
            <App.Flex gap={4}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text size={12} weight={400}>Big Reward</App.Text>
            </App.Flex>

            <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={26} weight={700}>$10</App.ShadowText>
            <App.Text size={14} weight={500}>Odds: 4%</App.Text>
          </App.Flex>
          
          <App.Flex column align="center" className={styles.rewardBlock} gap={8}>
            <App.Flex gap={4}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text size={12} weight={400}>Jumbo Reward</App.Text>
            </App.Flex>

            <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={26} weight={700}>$50</App.ShadowText>
            <App.Text size={14} weight={500}>Odds: 1%</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles.hiddenOnMobile)}>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text size={12} height={1}>{item.totalTransferred}/{item.rewardAmount} reward distributed</App.Text>
        </App.Flex>

        <App.Button primary sx={{width: 240}} onClick={() => handleClick(item)}>
          Open Container
        </App.Button>
      </App.Flex>
    </>
  )
}

export default RaffleInfoModal