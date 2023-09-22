import { useState, useEffect } from 'react'
import RoulettePro from 'react-roulette-pro'
import 'react-roulette-pro/dist/index.css'

import App from '@/components/App'
import rouletteDesign from './RouletteDesign'

const prizes = [
  {
    image: '/images/raffle/box-common.png',
    winner: false,
  },
  {
    image: '/images/raffle/box-uncommon.png',
    winner: false,
  },
  {
    image: '/images/raffle/box-legendary.png',
    winner: true,
  },
]

const getRandomWinnerIndex = (arr) => {
  const winners = arr.filter(item => item.winner === true)
  const randomIndex = Math.floor(Math.random() * winners.length)
  const randomWinner = winners[randomIndex]
  const originalIndex = arr.indexOf(randomWinner)

  return originalIndex
}

const reproductionArray = (array = [], length = 0) => [
  ...Array(length)
    .fill('_')
    .map(() => array[Math.floor(Math.random() * array.length)]),
]

const reproducedPrizeList = [
  ...prizes,
  ...reproductionArray(prizes, prizes.length * 10),
  ...prizes,
  ...reproductionArray(prizes, prizes.length),
]

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`

const prizeList = reproducedPrizeList.map((prize) => ({
  ...prize,
  id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : generateId(),
}))

const RaffleRoulette = ({autoStart = false, onPrizeDefined}) => {
  const [start, setStart] = useState(false)

  // const prizeIndex = prizes.length * 4 + winPrizeIndex
  let prizeIndex = getRandomWinnerIndex(prizeList)

  useEffect(() => {
    if (autoStart) {
      handleStart()
    }
  }, [autoStart])

  const handleStart = () => {
    setStart((prevState) => !prevState)
  }

  const handlePrizeDefined = () => {
    onPrizeDefined()
  }

  return (
    <App.Flex column gap={16} width="100%">
      <RoulettePro
        prizes={prizeList}
        prizeIndex={prizeIndex}
        start={start}
        onPrizeDefined={handlePrizeDefined}
        options={{
          withoutAnimation: true,
          // stopInCenter: false,
        }}
        spinningTime={16}
        transitionFunction={'cubic-bezier(0.1, 0.1, 0.2, 1)'}
        designPlugin={rouletteDesign}
      />
      {/* <App.Flex justify="center">
        <App.Button sx={{width: 210}} onClick={handleStart}>Start</App.Button>
      </App.Flex> */}
    </App.Flex>
  )
}

export default RaffleRoulette