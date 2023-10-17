import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'
import moment from 'moment'

import { usePropsHelper } from '@/myhooks/props-helper'
import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $modal from '@/store/modal'
import $raffle from '@/store/raffle'

import Contracts from '@/libs/contracts.lib'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import FirstStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/FirstStep'
import SecondStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/SecondStep'
import ThirdStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/ThirdStep'
import FourthStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/FourthStep'
import ErrorStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/ErrorStep'
import ConfirmationStep from '@/components/Raffle/RaffleModalParticipate/ClaimSteps/ConfirmationStep'
import RaffleReward from '@/components/Raffle/RaffleModalParticipate/RaffleReward'

import styles from './styles.module.scss'

const RaffleModalParticipate = ({item, onUpdateUserTKeys, getUserTKeysBalance, onUpdateUserCases, onShare}) => {
  const dispatch = useDispatch()
  const { propValue } = usePropsHelper()
  const { wallet, changeNetwork } = useWalletConnect()
  
  const contract = new Contracts()

  const blockchain = useSelector($app.get.blockchain)
  const balance = useSelector(({$raffle}) => $raffle.balance)
  const tokenIds = useSelector(({ $raffle }) => $raffle.tokenIds)

  const [showClaim, setShowClaim] = useState(false)
  const [step, setStep] = useState(0)
  const [isApproved, setIsApproved] = useState(false)
  const [expectedReward, setExpectedReward] = useState(null)
  const [errorType, setErrorType] = useState('')

  const rewards = [...item.rewardRange]

  useEffect(() => {
    (async () => {
      if (wallet) {
        const result = await checkIfApproved()
        setIsApproved(result)
      }
    })()
  }, [wallet])

  useEffect(() => {
    if (expectedReward) {
      setStep(3)
    }
  }, [expectedReward])

  const handleClickOpen = async () => {
    const res = await onUpdateUserTKeys(item.tKeyRequired)

    if (res.length !== item.tKeyRequired*1) {
      setStep('error')
      setErrorType('balance')
      dispatch($modal.set.update({
        header: {
          title: 'Insufficient TKeys Balance',
        },
      }))
    }
    trackEvent('Click Unlock With TKeys', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Tkeys Quantity': balance,
      'TKeys Required': item.tKeyRequired,
      'Market': 'USDT',
    })
    setStep(isApproved ? 1 : 0)
    setShowClaim(true)
    if (! isApproved) {
      dispatch($modal.set.update({
        header: {
          title: 'Approve Transaction',
        },
      }))

      return
    }

    dispatch($modal.set.update({
      header: {
        title: 'Deposit TKeys',
      },
    }))
  }

  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  const checkIfApproved = async () => {
    const res = await contract.isApprovedForAll(blockchain.raffle.contract, wallet, blockchain.raffle.factory)
    return res
  }

  const handleClickNextStep = async () => {
    const network = await changeNetwork(blockchain.code)
    if ( ! network) {
      return
    }

    if (step === 0) {
      if (! isApproved) {
        trackEvent('Click Approve Contract', {
          'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
          'Tkeys Quantity': balance,
          'TKeys Required': item.tKeyRequired,
          'Market': 'USDT',
        })
        const approveRes = await contract.setApprovalForAll(blockchain.raffle.contract, blockchain.raffle.factory)
        dispatch($raffle.set.loading(false))
        if (approveRes.error) {
          return
        }
      }

      dispatch($modal.set.update({
        header: {
          title: 'Deposit TKeys',
        },
      }))

      dispatch($raffle.set.loading(false))
    }
    
    if (step === 1) {
      const ids = tokenIds.slice(0, item.tKeyRequired)
      const enterCampaignHash = await contract.enterCampaign(blockchain.raffle.factory, item.id, ids)
      
      if (enterCampaignHash.error) {
        dispatch($raffle.set.loading(false))
        return
      }

      trackEvent('Click Confirm Deposit', {
        'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
        'Tkeys Quantity': balance,
        'TKeys Required': item.tKeyRequired,
        'Market': 'USDT',
      })

      console.log('enterCampaignHash', enterCampaignHash)
      dispatch($modal.set.update({
        header: {
          title: 'Blockchain Confirmation!',
        },
      }))
      
      getUserTKeysBalance()
      // onUpdateUserCases(true)
      fetchReward(enterCampaignHash)
    }

    if (step === 3) {
      dispatch($modal.set.update({
        header: {
          title: 'Congratulations!',
        },
      }))
    }

    if (step === 4) {
      handleCloseModal()
      return
    }

    setStep(step >= 4 ? 0 : step+1)
    dispatch($raffle.set.loading(false))
  }

  const fetchReward = async (enterCampaignHash, maxTries = 10) => {
    if (maxTries > 0) {
      const result = await $raffle.api.reward(enterCampaignHash.trim())
      if (result?.data) {
        const parsedRes = JSON.parse(result.data)
    
        console.log('parsedRes', parsedRes)
        const rewardAmount = parsedRes[enterCampaignHash]?.expectedRewardAmount === '0' ? '0' : parsedRes[enterCampaignHash]?.expectedRewardAmount*1
        console.log('rewardAmount', rewardAmount)
    
        if (!rewardAmount) {
          setTimeout(() => {
            fetchReward(enterCampaignHash, (maxTries - 1))
          }, 2000)
        } else if (rewardAmount === '0') {
          setStep('error')
          setErrorType('api')
          dispatch($modal.set.update({
            header: {
              title: 'Something went wrong',
            },
          }))
        } else {
          setExpectedReward(rewardAmount)
  
          setStep(step >= 4 ? 0 : step + 1)
          dispatch($modal.set.update({
              header: {
                  title: 'Unlock Case',
              },
          }))
  
          dispatch($raffle.set.loading(false))
        }
        return
      }
    }  

    setStep('error')
    setErrorType('api')
    dispatch($modal.set.update({
      header: {
        title: 'Something went wrong',
      },
    }))
  }

  const handleCloseModal = () => {
    dispatch($modal.set.close())
    getUserTKeysBalance()
    onUpdateUserCases(true)
  }

  const handleClickShare = () => {
    trackEvent('Click Share Case Details', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })
    const shareText = `🎁✨ Did you know? You can open cases on Tegro and share rewards worth 💰💰 $10,000 in $USDT, $PEPE, $SHIB, and other tokens! Unlock your first case for FREE! Start here 👉 `
    onShare(shareText)
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
                  <Image src='/images/raffle/usdt.png' width={16} height={16} alt="" />
                  <App.Text size={[12, 10]} weight={400} height={1}>{item.totalTransferred}/{item.rewardAmount} USDT Won</App.Text>
                </App.Flex>
              ) : null}
            </App.Flex>

            <App.Flex justify="space-between" gap={16}>
              <App.Flex center sx={{ minWidth: propValue([65, 32], true) }} gap={16}>
                {/* <Image src={item.image} width={propValue([48, 32], true)} height={propValue([48, 32], true)} alt="" /> */}
                <App.Text size={20} weight={600}>{ item.title }</App.Text>
              </App.Flex>

              <App.Flex className={styles.shareButton} onClick={handleClickShare}>
                <App.Icon icon="share" />
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={32} align="center" justify="space-between" className={styles.content}>
            <App.Flex className={styles.titleBlock}>
              <Image src={item.image} width={70} height={64} alt="" />
              <App.Text center size={14} weight={400}>Possible rewards you can win</App.Text>
            </App.Flex>

            <App.Flex gap={16} className={styles.rewardsContainer}>
              {
                rewards.sort((a, b) => parseInt(a.range) - parseInt(b.range)).map((reward, index) => {
                  const currentReward = item.odds.find(odd => odd.range === reward.range*1)
                  if (!currentReward) {
                    return
                  }
                  const title = currentReward.title
                  const odds = currentReward.odds
                  const amount = reward.reward / 1000000
                  return (
                    <RaffleReward key={index} title={title} amount={`$${amount}`} additionalText={`Odds: ${odds}%`} />
                  )
                })
              }
            </App.Flex>

            <App.Flex column gap={16}>
              {/* <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles.hiddenOnMobile)}>
                <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
                <App.Text size={12} height={1}>{item.totalTransferred}/{item.rewardAmount} reward distributed</App.Text>
              </App.Flex> */}

              <App.Button primary sx={{width: 240, height: 56, fontSize: 16, fontWeight: 600}} onClick={handleClickOpen}>
                Unlock with { item.tKeyRequired } TKeys
              </App.Button>
            </App.Flex>
          </App.Flex>
        </>
      : <>
          {
            step !== 4 && step !== 'error'
              ? <App.Flex row gap={8} className={styles.headerContent}>
                  <App.Flex column flex={1} gap={2}>
                    <div className={cn(styles.progress, {[styles.active]: step >= 0})} />
                  </App.Flex>
                  <App.Flex column flex={1} gap={2}>
                    <div className={cn(styles.progress, {[styles.active]: step >= 1})} />
                  </App.Flex>
                  <App.Flex column flex={1} gap={2}>
                    <div className={cn(styles.progress, {[styles.active]: step >= 2})} />
                  </App.Flex>
                  <App.Flex column flex={1} gap={2}>
                    <div className={cn(styles.progress, {[styles.active]: step >= 3})} />
                  </App.Flex>
                </App.Flex>
              : null
          }          
          
          <App.Flex column gap={32} align="center" justify={step === 2 ? 'center' : 'space-between'} className={styles.content} sx={{padding: step === 2 ? 0 : 32, height: 600}}>
            {
              (currentStep => {
                switch (currentStep) {
                  case 0:
                    return (
                      <FirstStep campaign={item} onSubmit={handleClickNextStep} />
                    )
                  case 1:
                    return (
                      <SecondStep campaign={item} onSubmit={handleClickNextStep} />
                    )
                  case 2:
                    return (
                      <ConfirmationStep />
                    )
                  case 3:
                    return (
                      <ThirdStep campaign={{...item, expectedReward}} onSubmit={handleClickNextStep} />
                    )
                  case 'error':
                    return (
                      <ErrorStep type={errorType} onSubmit={handleCloseModal} />
                    )
                  default:
                    return <FourthStep campaign={{...item, expectedReward}} onSubmit={handleClickNextStep} onShare={onShare} />
                }
              })(step)
            }
          </App.Flex>
        </>
  )
}

export default RaffleModalParticipate