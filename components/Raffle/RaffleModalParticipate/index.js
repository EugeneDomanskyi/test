import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'
import moment from 'moment'

import { usePropsHelper } from '@/myhooks/props-helper'
import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'
import $raffle from '@/store/raffle'

import Contracts from '@/libs/contracts.lib'

import App from '@/components/App'
import FirstStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/FirstStep'
import SecondStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/SecondStep'
import ThirdStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/ThirdStep'

import styles from './styles.module.scss'

const contractAddr = '0x9bfdfdac362f810ff15240045e600a7468caf91c' //'0xddbe6cb6c57511e36e3fe6c06a2de92d196cda84'
const factoryAddr = '0x6730d9E6f08E23DCC680D577af918Ae1CeD28230' //'0xA4cDD0FEe85c917A68a9432a3ebfF1f66E9f281A'

const RaffleModalParticipate = ({item}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { propValue } = usePropsHelper()
  const { wallet } = useWalletConnect()

  const contract = new Contracts()

  const showModal = useSelector((state) => state.$modal.show)
  const tokenIds = useSelector(({ $raffle }) => $raffle.tokenIds)

  const [showClaim, setShowClaim] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!showModal) {
      router.push('/raffle', undefined, { scroll: false })
    }
  }, [showModal])

  const handleClickOpen = async () => {
    const isApproved = await checkIfApproved()
    setStep(isApproved ? 1 : 0)
    setShowClaim(true)
  }

  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  const checkIfApproved = async () => {
    const res = await contract.isApprovedForAll(contractAddr, wallet, factoryAddr)
    console.log('res', res);
    return res
  }

  const handleClickNextStep = async () => {
    if (step === 0) {
      const isApproved = await checkIfApproved()
      if (! isApproved) {
        const approveRes = await contract.setApprovalForAll(contractAddr, factoryAddr)
        dispatch($raffle.set.loading(false))
        if (approveRes.error) {
          return
        }
      }

      dispatch($raffle.set.loading(false))
    }
    
    if (step === 1) {
      if (tokenIds.length < item.tKeyRequired) {
        return
      }

      const ids = tokenIds.slice(0, item.tKeyRequired)
      const enterCampaignHash = await contract.enterCampaign(factoryAddr, item.id, ids)
      
      if (enterCampaignHash.error) {
        dispatch($raffle.set.loading(false))
        return
      }

      const result = await $raffle.api.reward(enterCampaignHash)
      console.log('result', result);
      dispatch($raffle.set.loading(false))
    }

    if (step === 2) {
      dispatch($modal.set.close())
      return
    }

    setStep(step >= 2 ? 0 : step+1)
  }

  return (
    ! showClaim
      ? <>
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

            <App.Flex justify="space-between" gap={16}>
              <App.Flex center sx={{ minWidth: propValue([65, 32], true) }} gap={16}>
                {/* <Image src={item.image} width={propValue([48, 32], true)} height={propValue([48, 32], true)} alt="" /> */}
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
              {
                item.rewardRange.map((reward, index) => {
                  const currentReward = item.odds.find(odd => odd.range === reward.range*1)
                  if (!currentReward) {
                    return
                  }
                  const title = currentReward.title
                  const odds = currentReward.odds
                  const amount = reward.reward / 1000000
                  return (
                    <App.Flex key={index} column align="center" className={styles.rewardBlock} gap={8}>
                      <App.Flex gap={4}>
                        <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
                        <App.Text size={12} weight={400}>{title}</App.Text>
                      </App.Flex>

                      <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={26} weight={700}>${amount}</App.ShadowText>
                      <App.Text size={14} weight={500}>Odds: {odds}%</App.Text>
                    </App.Flex>
                  )
                })
              }
            </App.Flex>

            <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles.hiddenOnMobile)}>
              <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
              <App.Text size={12} height={1}>{item.totalTransferred}/{item.rewardAmount} reward distributed</App.Text>
            </App.Flex>

            <App.Button primary sx={{width: 240}} onClick={handleClickOpen}>
              Open Container
            </App.Button>
          </App.Flex>
        </>
      : <>
          <App.Flex row gap={8} className={styles.headerContent}>
            <App.Flex column flex={1} gap={2}>
              <div className={cn(styles.progress, {[styles.active]: step >= 0})} />
            </App.Flex>
            <App.Flex column flex={1} gap={2}>
              <div className={cn(styles.progress, {[styles.active]: step >= 1})} />
            </App.Flex>
            <App.Flex column flex={1} gap={2}>
              <div className={cn(styles.progress, {[styles.active]: step >= 2})} />
            </App.Flex>
          </App.Flex>
          
          <App.Flex column gap={32} align="center" className={styles.content} sx={{padding: step === 2 ? 0 : 32}}>
            {
              (currentStep => {
                switch (currentStep) {
                  case 0:
                    return (
                      <FirstStep item={item} onSubmit={handleClickNextStep} />
                    )
                  case 1:
                    return (
                      <SecondStep item={item} onSubmit={handleClickNextStep} />
                    )
                  default:
                    return <ThirdStep item={item} onSubmit={handleClickNextStep} />
                }
              })(step)
            }
          </App.Flex>
        </>
  )
}

export default RaffleModalParticipate