import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'

import useWalletConnect from '@/myhooks/wallet-connect'
import Contracts from '@/libs/contracts.lib'

import $app from '@/store/app'

import App from '@/components/App'
import FaucetSteps from '@/components/Faucet/FaucetSteps'
import FaucetConnect from '@/components/Faucet/FaucetConnect'
import FaucetMatic from '@/components/Faucet/FaucetMatic'
import FaucetToken from '@/components/Faucet/FaucetToken'
import FaucetComplete from '@/components/Faucet/FaucetComplete'
import FaucetTimer from '@/components/Faucet/FaucetTimer'

import styles from './styles.module.scss'

const Faucet = () => {
  const { wallet, connection, getBasicInfo } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)

  const [step, setStep] = useState()
  const [timeLeft, setLeftTime] = useState()
  const [balances, setBalances] = useState({ BTC: 0, ETH: 0, USDT: 0 })

  const contracts = new Contracts()

  const symbols = ['BTC', 'ETH', 'USDT']

  useEffect(() => {
    (async () => {
      if (!connection.loading) {
        let nextStep = connection.connected ? 2 : 1

        if (connection.connected) {
          const time = await getTime()
          if (time > 0) {
            nextStep = 5
            setLeftTime(time)
          }
        }
        
        getBalances()
        handleStepChange(nextStep)()
      }
    })()
  }, [connection])

  const getTime = async () => {
    const calls = symbols.map(item => {
      return contracts.nextClaimTime(wallet, process.env.NEXT_PUBLIC_FAUCET_CONTRACT, item)
    })

    const times = await Promise.all(calls)
    const time = times.reduce((acc, value) => {
      return Math.max(acc, value * 1)
    }, 0)

    if (time) {
      const nextTime = moment(time * 1000)
      const currentTime = moment()

      const diffMilliseconds = nextTime.diff(currentTime)
      const diffSeconds = Math.floor(diffMilliseconds / 1000)

      return diffSeconds
    }

    return 0
  }

  const getBalances = async () => {
    const calls = symbols.map(item => {
      return contracts.tokens(process.env.NEXT_PUBLIC_FAUCET_CONTRACT, item)
    })

    const tempBalance = { BTC: 0, ETH: 0, USDT: 0 }
    const results = await Promise.all(calls)
    for (const result of results) {
      const info = await getBasicInfo(result[0], blockchain.id)
      
      if (info) {
        const perMint = Number(result[1])
        const totalBalance = Number(result[2])
        const currentBalance = Math.min(perMint, totalBalance)

        tempBalance[info.symbol] = currentBalance / Math.pow(10, info.decimals)
      }
    }

    setBalances(tempBalance)
  }

  const handleStepChange = (newStep) => () => {
    setStep(newStep)
  }

  const StepComponent = () => {
    switch (step) {
      case 1: return <FaucetConnect onComplete={handleStepChange(2)} />
      case 2: return <FaucetMatic onComplete={handleStepChange(3)} />
      case 3: return <FaucetToken balances={balances} onComplete={handleStepChange(4)} />
      case 4: return <FaucetComplete />
      case 5: return <FaucetTimer time={timeLeft} onComplete={handleStepChange(2)} />
    }
  }

  return (
    <App.Flex full className={styles.container}>
      <div className={styles.circle} />

      <App.Flex column align="center" gap={48} fullWidth className={styles.content}>
        <App.Flex column center gap={8} className={styles.header}>
          <App.Text center size={32} weight={700} height={1}>Claim $100 worth mock BTC, ETH & USDT</App.Text>
          <App.Text center weight={400} color="gba(255, 255, 255, 0.50)">Every Four Hours. Explore the Crypto World Risk-Free!</App.Text>
        </App.Flex>

        <App.Flex column className={styles.box}>
          {step < 5 ? (
            <FaucetSteps step={step} />
          ) : null}

          {connection.loading ? (
            <App.LoaderBlock height={510} flex={null}/>
          ) : StepComponent()}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default Faucet