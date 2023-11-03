import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import lottie from 'lottie-web'
import Image from 'next/image'
import moment from 'moment'
import animationData from '@/public/animations/confetti_new.json'
import styles from './styles.module.scss'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'
import RaffleReward from '@/components/Raffle/RaffleModalParticipate/RaffleReward'

const FourthStep = ({ campaign, onSubmit, onShare }) => {
  const audioRef = useRef(null)

  const [showConfetti, setShowConfetti] = useState(true)
  const [prize, setPrize] = useState({ amount: '', title: '' })

  console.log('prize', prize);

  useEffect(() => {
    const currentPrize = campaign.rewardRange.find(item => item.reward * 1 === campaign.expectedReward)
    const currentReward = campaign.rewards.find(item => item.range === currentPrize.range * 1)
    setPrize({ amount: currentPrize.reward / 1000000, title: currentReward?.title })
  }, [])

  useEffect(() => {
    if (prize.amount) {
      const anim = lottie.loadAnimation({
        container: document.getElementById('lottie-container'),
        animationData: animationData,
        renderer: 'svg',
        loop: false,
        autoplay: true,
      })

      anim.onComplete = () => {
        setShowConfetti(false)
      }

      return () => {
        anim.destroy()
      }
    }
  }, [prize])

  useEffect(() => {
    if (audioRef.current && prize.amount) {
      audioRef.current.play()
    }
  }, [audioRef, prize])

  const handleClickNextStep = () => {
    onSubmit()
  }

  const getTime = (item) => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  const handleClickShare = () => {
    trackEvent('Click Case Share ', {
      'Name': campaign.title,
      'Time Left': getTime(campaign),
      'Tkey Cost': campaign.tKeyRequired,
      'Case ID': campaign.id,
      'Page': 'Case History',
    })
    // const shareText = `🥳💸 Woohoo! I just won $${prize.amount} USDT from a case! You can win $USDT, $PEPE, $SHIB, $FLOKI, and other tokens in the $10000 Tegro Treasure Case series! 💰💰 Join me now! Unlock your first Tegro case 🎁 for FREE! 👀 Start here 👉`
    const shareText = `🎉 Woohoo! I just won $${prize.amount} USDT by opening a case in the $10,000+ @TegroFi Treasure Case series! \n\n#UnboxHappiness #TegroEarn \n\n Start your own winning streak here ⬇️⬇️\n`
    onShare(shareText)
  }

  return (
    prize.amount
      ? <>
        <audio ref={audioRef} src='/audio/roulette_win_original.wav'></audio>
        {
          showConfetti
            ? <App.Flex id="lottie-container" className={styles.confetti} />
            : null
        }

        <App.Flex className={cn(styles.titleBlock, styles[prize.title])}>
          <Image src={campaign.image} width={70} height={64} alt="" />
          <App.Text center size={14} weight={400}>Reward unlocked successfully!</App.Text>
        </App.Flex>

        <App.Flex>
          <App.ShadowText color="#FFCB04" shadowColor="#FF7708" center size={26} weight={700}>YOU HAVE WON!</App.ShadowText>
        </App.Flex>

        <App.Flex column center gap={8} sx={{ position: 'relative' }}>
          <App.Icon icon="tegro-logo-text" />
          <RaffleReward title={prize.title} amount={prize.amount} bgGlow additionalText="Reward" />
        </App.Flex>

        <App.Flex>
          <ClaimText
            title="Reward will reflect in your wallet within 15 mins!"
            subTitle=""
          />
        </App.Flex>

        <App.Flex gap={16}>
          <App.Button outlined sx={{ width: 107, height: 56, fontSize: 16 }} onClick={handleClickNextStep}>
            Open Again
          </App.Button>

          <App.Button primary sx={{ width: 240, height: 56, fontSize: 16, borderColor: '#7204FF' }} onClick={handleClickShare}>
            Share & Earn 3 Tkeys
          </App.Button>
        </App.Flex>
      </>
      : <App.LoaderBlock />

  )
}

export default FourthStep