import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import Slider from 'react-slick'
import cn from 'classnames'

import $bot from '@/store/bot'

import App from '@/components/App'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './styles.module.scss'

const BotOnboarding = () => {
  const dispatch = useDispatch()

  const [slideHeight, setSlideHeight] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(1)
  const [loading, setLoading] = useState(false)

  const onboardingRef = useRef(null)
  const sliderRef = useRef(null)

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    adaptiveHeight: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  useEffect(() => {
    if (onboardingRef?.current) {
      calculateHeight()

      window.addEventListener('resize', calculateHeight)
      return () => window.removeEventListener('resize', calculateHeight)
    }
  }, [onboardingRef?.current])

  const calculateHeight = () => {
    const height = onboardingRef.current.offsetHeight
    setSlideHeight(height)
  }

  const handleNext = () => {
    if (currentSlide == 6) {
      fetchUser()
      return
    }

    sliderRef.current?.slickNext()
    setCurrentSlide((current) => current + 1)
  }

  const fetchUser = async () => {
    setLoading(true)
    const result = await $bot.api.claim({ type: 'signup_telegram' })
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    }
    setLoading(false)
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex ref={onboardingRef} fullWidth flex={1} className={styles.content}>
        <div className={styles.inner}>
          {slideHeight > 0 ? (
            <Slider ref={slider => { sliderRef.current = slider }} {...settings}>
              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Flex className={styles.onboardingTop1}>
                    <App.Flex column align="flex-end" justify="flex-end" className={styles.name}>
                      <App.Flex center className={styles.text}>
                        <App.Text size={12} weight={600} height={1}>10 USDC</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex column justify="center" className={styles.discount}>
                      <App.Flex column>
                        <App.Text size={36} weight={800} color="#FFBB01" height={1}>90%</App.Text>
                        <App.Text size={36} weight={800} color="#FFBB01" height={1}>OFF</App.Text>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                  
                  <App.Flex column fullWidth gap={8} className={cn(styles.textBlock, styles.yellow)}>
                    <App.Text size={24} weight={700} height={1}>Get $10 USDC</App.Text>
                    <App.Text size={24} weight={700} height={1}>starting at $1 only 🤑</App.Text>

                    <App.Flex className={styles.onboardingImage1}/>
                  </App.Flex>
                </div>
              </div>

              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Flex column fullWidth gap={8} className={cn(styles.textBlock, styles.orange)}>
                    <App.Text size={24} weight={700} height={1}>Outbid your opponents</App.Text>
                    <App.Text size={24} weight={700} height={1}>and win $$$ using gems ⚔️</App.Text>

                    <App.Flex className={styles.onboardingImage2}/>
                  </App.Flex>
                </div>
              </div>

              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Flex className={styles.taskContainer} column gap={8}>
                    <App.Flex fullWidth justify="space-between" gap={8}>
                      <App.Text size={14} weight={600}>1. Join Our Telegram Channel</App.Text>

                      <App.Flex row center gap={4}>
                        <App.Text color="#67C9F9" size={14} weight={600} inline>2000</App.Text>
                        <Image src="/images/bot/gem.png" width={16} height={12} alt="" />
                      </App.Flex>
                    </App.Flex>

                    <App.Text className={styles.taskDescription}>Get latest updates on auctions, talk to fellow bidders, and win exciting rewards.</App.Text>

                    <App.Button variant="bot">
                      Verify & Claim
                      <App.Flex row center gap={4}>
                        <App.Text size={14} weight={600} inline>2000</App.Text>
                        <Image src="/images/bot/gem.png" width={16} height={12} alt="" />
                      </App.Flex>
                    </App.Button>
                  </App.Flex>

                  <App.Flex column fullWidth gap={8} className={cn(styles.textBlock, styles.green)}>
                    <App.Text size={24} weight={700} height={1}>Complete Tasks,</App.Text>
                    <App.Text size={24} weight={700} height={1}>Earn gems 💎</App.Text>

                    <App.Flex className={styles.onboardingImage3}/>
                  </App.Flex>
                </div>
              </div>

              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Flex className={styles.onboardingTop2} />

                  <App.Flex column fullWidth gap={8} className={cn(styles.textBlock, styles.blue)}>
                    <App.Text size={24} weight={700} height={1}>Buy Gems from</App.Text>
                    <App.Text size={24} weight={700} height={1}>shop</App.Text>

                    <App.Flex className={styles.onboardingImage4}/>
                  </App.Flex>
                </div>
              </div>

              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Flex className={styles.onboardingTop3}>
                    <App.Text size={24} weight={900} height={1} color="#A6DC37" className={styles.text}>+10,000</App.Text>
                  </App.Flex>

                  <App.Flex column fullWidth gap={8} className={cn(styles.textBlock, styles.red)}>
                    <App.Text size={24} weight={700} height={1}>Invite your friends</App.Text>
                    <App.Text size={24} weight={700} height={1}>and earn together 💁‍♂️</App.Text>

                    <App.Flex className={styles.onboardingImage5}/>
                  </App.Flex>
                </div>
              </div>

              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Flex className={styles.onboardingTop4}>
                    <App.Text center size={32} weight={900} height={1} color="#A6DC37" className={styles.text}>+5000 Gems</App.Text>
                  </App.Flex>

                  <App.Flex column fullWidth gap={8} className={cn(styles.textBlock, styles.purple)}>
                    <App.Text size={24} weight={700} height={1}>Your joining Bonus</App.Text>
                    <App.Text size={24} weight={700} height={1}>is here! 🎁</App.Text>
                  </App.Flex>
                </div>
              </div>
            </Slider>
          ) : null}
        </div>
      </App.Flex>

      <App.Flex column gap={16} className={styles.bottom}>
        <App.Flex row center gap={8}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={cn(styles.dot, { [styles.active]: index + 1 === currentSlide })} />
          ))}
        </App.Flex>

        <App.Button variant="bot" loading={loading} onClick={handleNext}>{currentSlide == 6 ? 'Start Bidding Now!' : 'Continue'}</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default BotOnboarding