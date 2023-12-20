import { useEffect, useState } from 'react'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import FaucetConnect from '@/components/Faucet/FaucetConnect'
import FaucetMatic from '@/components/Faucet/FaucetMatic'
import FaucetToken from '@/components/Faucet/FaucetToken'
import FaucetComplete from '@/components/Faucet/FaucetComplete'

import styles from './styles.module.scss'

const Faucet = () => {
  const { connection } = useWalletConnect()

  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!connection.loading) {
      handleStepChange(connection.connected ? 2 : 1)()
    }
  }, [connection])

  const handleStepChange = (newStep) => () => {
    setStep(newStep)
  }

  const StepComponent = () => {
    switch (step) {
      case 1: return <FaucetConnect onComplete={handleStepChange(2)} />
      case 2: return <FaucetMatic onComplete={handleStepChange(3)} />
      case 3: return <FaucetToken onComplete={handleStepChange(4)} />
      case 4: return <FaucetComplete onComplete={handleStepChange(5)} />
    }
  }

  return (
    <App.Flex full className={styles.container}>
      <div className={styles.circle} />

      <App.Flex column align="center" gap={48} fullWidth className={styles.content}>
        <App.Flex column center gap={8}>
          <App.Text center size={32} weight={700} height={1}>Claim $100 worth mock BTC, ETH & USDT</App.Text>
          <App.Text center weight={400} color="gba(255, 255, 255, 0.50)">Every Four Hours. Explore the Crypto World Risk-Free!</App.Text>
        </App.Flex>

        <App.Flex column className={styles.box}>
          <App.Flex row className={styles.steps}>
            <App.Flex column center gap={8} flex={1} className={cn(styles.step, {[styles.current]: step == 1}, {[styles.past]: step > 1})}>
              <App.Flex center className={styles.dot}>
                <App.Icon icon="check" width={10} height={8} />
              </App.Flex>
              <App.Text center size={12} weight={400} className={styles.stepText}>Connect Wallet</App.Text>
            </App.Flex>

            <App.Flex column center gap={8} flex={1} className={cn(styles.step, {[styles.current]: step == 2}, {[styles.past]: step > 2})}>
              <App.Flex center className={styles.dot}>
                <App.Icon icon="check" width={10} height={8} />
              </App.Flex>
              <App.Text center size={12} weight={400} className={styles.stepText}>Claim MATIC</App.Text>
            </App.Flex>

            <App.Flex column center gap={8} flex={1} className={cn(styles.step, {[styles.current]: step == 3}, {[styles.past]: step > 3})}>
              <App.Flex center className={styles.dot}>
                <App.Icon icon="check" width={10} height={8} />
              </App.Flex>
              <App.Text center size={12} weight={400} className={styles.stepText}>Claim Token</App.Text>
            </App.Flex>
          </App.Flex>

          {connection.loading ? (
            <App.LoaderBlock height={510} flex={null}/>
          ) : StepComponent()}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default Faucet