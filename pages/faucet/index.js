import { useEffect, useState } from 'react'
import moment from 'moment'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import FaucetSteps from '@/components/Faucet/FaucetSteps'
import FaucetConnect from '@/components/Faucet/FaucetConnect'
import FaucetMatic from '@/components/Faucet/FaucetMatic'
import FaucetToken from '@/components/Faucet/FaucetToken'
import FaucetComplete from '@/components/Faucet/FaucetComplete'
import FaucetTimer from '@/components/Faucet/FaucetTimer'

import styles from './styles.module.scss'

const Faucet = () => {
  const { connection } = useWalletConnect()

  const [step, setStep] = useState()
  const [timeLeft, setLeftTime] = useState()

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
        
        handleStepChange(nextStep)()
      }
    })()
  }, [connection])

  const getTime = async () => {
    const period = 4 * 60 * 60
    const lastTime = moment('2023-12-20T07:56:00')
    const currentTime = moment()

    const diffMilliseconds = currentTime.diff(lastTime)
    const diffSeconds = Math.floor(diffMilliseconds / 1000)

    return period - diffSeconds
  }

  const handleStepChange = (newStep) => () => {
    setStep(newStep)
  }

  const StepComponent = () => {
    switch (step) {
      case 1: return <FaucetConnect onComplete={handleStepChange(2)} />
      case 2: return <FaucetMatic onComplete={handleStepChange(3)} />
      case 3: return <FaucetToken onComplete={handleStepChange(4)} />
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