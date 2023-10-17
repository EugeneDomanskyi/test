import { useState, useEffect, useRef } from 'react'
import RoulettePro from 'react-roulette-pro'
import 'react-roulette-pro/dist/index.css'
import styles from './styles.module.scss'

import App from '@/components/App'
import RaffleReward from '@/components/Raffle/RaffleModalParticipate/RaffleReward'

const RaffleRoulette = ({autoStart = false, onPrizeDefined, campaign}) => {
  const [start, setStart] = useState(false)

  const prizes = []

  campaign.rewardRange.map((reward, index) => {
    const currentReward = campaign.odds.find(odd => odd.range === reward.range*1)
    if (!currentReward) {
      return
    }
    const title = currentReward.title
    const amount = reward.reward / 1000000
    
    prizes.push(
      {
        component: <RaffleReward title={title} amount={`${amount} USDT`} additionalText="Reward" size="large" />,
        winner: reward.reward*1 === campaign.expectedReward
      }
    )
  })

  const handleStart = () => {
    setStart((prevState) => !prevState)
  }

  const handlePrizeDefined = () => {
    onPrizeDefined()
  }

  const getRandomWinnerIndex = (arr) => {
    const winners = arr.filter(item => item.winner === true)
    const winnersCount = winners.length
    
    const weightTowardsEnd = 3

    const weights = winners.map((_, index) => {
        const weight = index < winnersCount / weightTowardsEnd ? 1 : weightTowardsEnd
        return { index, weight }
    })

    const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0)

    const randomValue = Math.random() * totalWeight

    let accumulatedWeight = 0
    for (const entry of weights) {
        accumulatedWeight += entry.weight
        if (accumulatedWeight >= randomValue) {
            return arr.indexOf(winners[entry.index])
        }
    }

    return arr.indexOf(winners[winnersCount - 1])
  }

  // const getRandomWinnerIndex = (arr) => {
  //   const winners = arr.filter(item => item.winner === true)
  //   const randomIndex = Math.floor(Math.random() * winners.length)
  //   const randomWinner = winners[randomIndex]
  //   const originalIndex = arr.indexOf(randomWinner)
  
  //   return originalIndex
  // }
  
  const reproductionArray = (array = [], length = 0) => [
    ...Array(length)
      .fill('_')
      .map(() => array[Math.floor(Math.random() * array.length)]),
  ]
  
  const reproducedPrizeList = [
    ...prizes,
    ...reproductionArray(prizes, prizes.length * 30),
    ...prizes,
    ...reproductionArray(prizes, prizes.length),
  ]
  
  const generateId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`
  
  const prizeList = reproducedPrizeList.map((prize) => ({
    ...prize,
    id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : generateId(),
  }))

  let prizeIndex = getRandomWinnerIndex(prizeList)
  // let prizeIndex = 25

  const prizeItem = (item) => {
    return (      
      <App.Flex key={item.id} sx={{padding: '0 16px'}}>
        { item.component }
      </App.Flex>
    )
  }

  useEffect(() => {
    if (autoStart) {
      handleStart()
    }
  }, [autoStart])

  return (
    <App.Flex column gap={16} width="100%" className={styles.scrollContainer}>
      <RoulettePro
        prizes={prizeList}
        prizeIndex={prizeIndex}
        prizeItemRenderFunction={prizeItem}
        start={start}
        onPrizeDefined={handlePrizeDefined}
        options={{
          withoutAnimation: true,
        }}
        spinningTime={5}
        transitionFunction={'cubic-bezier(0,0.24,0.09,1)'}
        designPlugin={() => ({
          prizeItemWidth: 294,
          prizeItemHeight: 168,
          topChildren:
            <div
              className={styles.topArrow}
            />,
          bottomChildren:
            <div
              className={styles.bottomArrow}
            />,
          classes: { wrapper: styles.rouletteWrapper }
        })}
        soundWhileSpinning="/audio/roulette_spin.mp3"
        // soundWhileSpinning="https://react-roulette-pro.ivanadmaers.com/assets/f3722b4574da2a35a4ef.mp3"
      />

      
    </App.Flex>
  )
}

export default RaffleRoulette