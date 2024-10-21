import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import cn from 'classnames'

import App from '@/components/App'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './styles.module.scss'

const BotOnboarding = () => {
  const [slideHeight, setSlideHeight] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(1)

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
    }
  }, [onboardingRef?.current])

  const calculateHeight = () => {
    const height = onboardingRef.current.offsetHeight
    setSlideHeight(height)
  }

  const handleNext = () => {
    sliderRef.current?.slickNext()
    setCurrentSlide((current) => current + 1)
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex ref={onboardingRef} fullWidth flex={1} className={styles.content}>
        <div className={styles.inner}>
          {slideHeight > 0 ? (
            <Slider ref={slider => { sliderRef.current = slider }} {...settings}>
              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Text>Slide 1</App.Text>
                </div>
              </div>

              <div style={{ lineHeight: 1 }}>
                <div style={{ height: slideHeight }} className={cn(styles.slide)}>
                  <App.Text>Slide 2</App.Text>
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

        <App.Button variant="bot" onClick={handleNext}>Continue</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default BotOnboarding