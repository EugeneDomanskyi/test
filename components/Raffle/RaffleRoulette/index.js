import { useState } from 'react'
import RoulettePro from 'react-roulette-pro'
import 'react-roulette-pro/dist/index.css'

import App from '@/components/App'

const prizes = [
  {
    image: 'https://i.ibb.co/6Z6Xm9d/good-1.png',
  },
  {
    image: 'https://i.ibb.co/T1M05LR/good-2.png',
  },
  {
    image: 'https://i.ibb.co/Qbm8cNL/good-3.png',
  },
  {
    image: 'https://i.ibb.co/5Tpfs6W/good-4.png',
  },
  {
    image: 'https://i.ibb.co/64k8D1c/good-5.png',
  },
]

const winPrizeIndex = 0

const reproductionArray = (array = [], length = 0) => [
  ...Array(length)
    .fill('_')
    .map(() => array[Math.floor(Math.random() * array.length)]),
]

const reproducedPrizeList = [
  ...prizes,
  ...reproductionArray(prizes, prizes.length * 3),
  ...prizes,
  ...reproductionArray(prizes, prizes.length),
]

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`

const prizeList = reproducedPrizeList.map((prize) => ({
  ...prize,
  id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : generateId(),
}))

const RaffleRoulette = () => {
  const [start, setStart] = useState(false)

  const prizeIndex = prizes.length * 4 + winPrizeIndex

  const handleStart = () => {
    setStart((prevState) => !prevState)
  }

  const handlePrizeDefined = () => {
    console.log('🥳 Prize defined! 🥳')
  }

  return (
    <App.Flex column gap={16}>
      <RoulettePro
        prizes={prizeList}
        prizeIndex={prizeIndex}
        start={start}
        onPrizeDefined={handlePrizeDefined}
        options={{withoutAnimation: true}}
        spinningTime={10}
        // transitionFunction={'ease-out'}
        transitionFunction={'cubic-bezier(0.1, 0.1, 0.2, 1)'}
      />
      <App.Button onClick={handleStart}>Start</App.Button>
    </App.Flex>
  )
}

export default RaffleRoulette