import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import cn from 'classnames'
import Draggable from 'react-draggable'

import $orders from '@/store/orders'

import App from '@/components/App'

import styles from './styles.module.scss'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

const OnboardingBanner = () => {
  const router = useRouter()
  const { wallet, connection, connect } = useWagmiHelper()

  const referral = useSelector(({ $gem }) => $gem.referral)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [showBanner, setShowBanner] = useState(false)
  const [stepBanner, setStepBanner] = useState()
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!connection.loading) {
      getBannerVisibility()
    }
  }, [connection.loading, connection.connected, wallet, referral])

  const getBannerVisibility = async () => {
    const onboardingStep = localStorage.getItem('onboardingStep')
    const onboardingExpand = localStorage.getItem('onboardingExpand') ?? true

    if (!connection.connected) {
      if (onboardingStep == null) {
        setStepBanner(0)
        setShowBanner(onboardingExpand == 'false' ? false : true)
      } else {
        setStepBanner(null)
      }
    } else {
      if (referral?.id) {
        if (!referral.rewarded_for_trade) {
          setStepBanner(1)
          setShowBanner(onboardingExpand == 'false' ? false : true)
          localStorage.setItem('onboardingStep', 1)
        } else {
          if (onboardingStep == 1) {
            setStepBanner(2)
            localStorage.setItem('onboardingStep', 2)

            setShowBanner(true)
            localStorage.setItem('onboardingExpand', true)
          } else {
            if (onboardingStep != 3) {
              handleClose()
            }
          }
        }
      }
    }
  }

  const handleConnect = () => {
    connect()
  }

  const handleToggle = () => {
    const value = !showBanner
    setShowBanner(value)
    localStorage.setItem('onboardingExpand', value)
  }

  const handleClose = (now = false) => {
    setShowBanner(false)
    localStorage.setItem('onboardingExpand', false)

    setTimeout(() => {
      setStepBanner(3)
      localStorage.setItem('onboardingStep', 3)
    }, (now ? 1 : 500))
  }

  const handlePD = () => {
    handleClose()
    localStorage.setItem('gemsTab', 'liquidity')
    router.push('/gems-dashboard')
  }
  
  const handleDrag = () => {
    if (!dragging) {
      setDragging(true)
    }
  }

  const handleStop = () => {
    if (!dragging) {
      handleToggle()
    }
    setDragging(false)
  }

  return stepBanner <= 2 ? (
    <>
      {isMobile && stepBanner == 1 && showBanner ? (
        <App.Flex className={styles.backdrop}>
        </App.Flex>
      ) : null}

      <App.Flex column className={styles.container}>
        {!isMobile ? (
          <App.Flex className={cn(styles.buttonBox, {[styles.show]: !showBanner})}>
            {stepBanner == 0 ? (
              <App.Flex row center gap={8} className={styles.expandButton} onClick={handleToggle}>
                <App.Text uppercase size={14} weight={700} height={1}>GET 150 GEMS</App.Text>
                <App.Icon icon="chevron-down" width={24} height={24} style={{ transform: 'rotate(180deg)' }}/>
              </App.Flex>
            ) : null}

            {stepBanner == 1 ? (
              <App.Flex row center gap={8} className={styles.expandButton} onClick={handleToggle}>
                <App.Text uppercase size={14} weight={700} height={1}>GET 100 GEMS</App.Text>
                <App.Icon icon="chevron-down" width={24} height={24} style={{ transform: 'rotate(180deg)' }}/>
              </App.Flex>
            ) : null}
          </App.Flex>
        ) : (
          stepBanner == 1 ? (
            <App.Flex className={cn(styles.mobileButtonBox, {[styles.show]: !showBanner})}>
              <Draggable 
                onDrag={handleDrag}
                onStop={handleStop}
                bounds="body"
              >
                <App.Flex row center gap={8} className={styles.expandButton}>
                  <App.Text uppercase size={14} weight={700} height={1}>GET 100 GEMS</App.Text>
                  <App.Icon icon="chevron-down" width={24} height={24} style={{ transform: 'rotate(180deg)' }}/>
                </App.Flex>
              </Draggable>
            </App.Flex>
          ) : null
        )}

        <App.Flex className={cn(styles.bannerBox, {[styles.show]: showBanner}, styles[`bannerBox${stepBanner}`])}>
          {stepBanner == 0 ? (
            <App.Flex column gap={16} className={styles.banner}>
              <App.Flex row justify="space-between" sx={{ cursor: 'pointer' }} onClick={handleToggle}>
                <App.Flex column gap={4}>
                  <App.Text size={16} weight={700} height={1}>Hey, want to get 150 gems?</App.Text>
                  <App.Text size={14} weight={400} height={1} color="#FFFFFF99">Start your earnings journey now!</App.Text>
                </App.Flex>

                {isMobile ? (
                  <App.Icon icon="cross" width={16} height={16} color="#fff" />
                ) : (
                  <App.Icon icon="chevron-down" width={24} height={24} />
                )}
              </App.Flex>

              <App.Flex column gap={8} className={styles.content}>
                <App.Text size={12} weight={400} height={1} color="#FFFFFF99">Step 1/2</App.Text>
                <App.Text size={16} weight={600} height={1}>Get <App.Text inline size={16} weight={600} height={1} color="#A6DC37">50</App.Text> gems</App.Text>
                <App.Text size={14} weight={400} height={1}>Connect your wallet to get 50 gems</App.Text>
              </App.Flex>

              <App.Button primary2 onClick={handleConnect}>Connect Wallet</App.Button>
            </App.Flex>
          ) : null}

          {stepBanner == 1 ? (
            <App.Flex column gap={16} className={styles.banner}>
              <App.Flex row justify="space-between" sx={{ cursor: 'pointer' }} onClick={handleToggle}>
                <App.Flex column gap={4}>
                  <App.Text size={16} weight={700} height={1}>{isMobile ? 'Hey, Your Earnings Journey Has Started!' : 'Place an order to get 100 gems.'}</App.Text>
                  <App.Text size={14} weight={400} height={1} color="#FFFFFF99">{isMobile ? 'Complete the remaining steps to get 100 gems.' : 'Your earnings journey has started!'}</App.Text>
                </App.Flex>

                <App.Icon icon="chevron-down" width={24} height={24} />
              </App.Flex>

              <App.Flex column gap={8} className={styles.content}>
                <App.Text size={12} weight={400} height={1} color="#FFFFFF99">Step 2/2</App.Text>
                <App.Text size={16} weight={600} height={1}>Get <App.Text inline size={16} weight={600} height={1} color="#A6DC37">100</App.Text> gems</App.Text>
                <App.Text size={14} weight={400} height={1}>Complete your first trade on Tegro to get 100 gems</App.Text>
              </App.Flex>

              {isMobile ? (
                <App.Flex column gap={8}>
                  <App.Button primary2 onClick={handleToggle}>Trade Now</App.Button>

                  <App.Flex center height={40} onClick={() => handleClose(true)}>
                    <App.Text size={14} weight={700} height={1} color="#FFFFFF99">Skip Onboarding</App.Text>
                  </App.Flex>
                </App.Flex>
              ) : null}
            </App.Flex>
          ) : null}

          {stepBanner == 2 ? (
            <App.Flex column gap={16} className={styles.banner}>
              <App.Flex row gap={16} justify="space-between">
                <App.Flex column gap={4}>
                  <App.Text size={16} weight={700} height={1}>Congratulations!</App.Text>
                  <App.Text size={14} weight={400} height={1.4} color="#FFFFFF99">You’ve won 150 gems for completing the onboarding. Trade more to win more.</App.Text>
                </App.Flex>

                <App.Icon icon="cross" width={20} height={20} color="#fff" sx={{ cursor: 'pointer' }} onClick={handleClose} />
              </App.Flex>

              <App.Flex row gap={16} align="center" justify="space-between" className={styles.content}>
                <App.Flex row align="center" gap={16}>
                  <App.Text size={12} weight={400} height={1} color="#FFFFFF99">Step 1</App.Text>
                  <App.Text size={16} weight={600} height={1} color="#FFFFFF99">Connect Wallet</App.Text>
                </App.Flex>

                <App.Icon icon="check-circle" />
              </App.Flex>

              <App.Flex row gap={16} align="center" justify="space-between" className={styles.content}>
                <App.Flex row align="center" gap={16}>
                  <App.Text size={12} weight={400} height={1} color="#FFFFFF99">Step 2</App.Text>
                  <App.Text size={16} weight={600} height={1} color="#FFFFFF99">Complete your first trade</App.Text>
                </App.Flex>

                <App.Icon icon="check-circle" />
              </App.Flex>

              <App.Flex column gap={8}>
                <App.Text size={16} weight={600} height={1}>You’re a gem miner now!</App.Text>
                <App.Button primary2 onClick={handlePD}>Check your stats</App.Button>
              </App.Flex>
            </App.Flex>
          ) : null}
        </App.Flex>
      </App.Flex>
    </>
  ) : null
}

export default OnboardingBanner