import { useState } from 'react'
import Slider from 'react-slick'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const SampleNextArrow = (props) => {
  const { onClick } = props
  return (
    <div
      className={cn(styles.arrow, styles.next)}
      onClick={onClick}
    >
      <App.Icon icon="chevron-right" color="#332D52" />
    </div>
  )
}

const SamplePrevArrow = (props) => {
  const { onClick } = props
  return (
    <div
      className={cn(styles.arrow, styles.prev)}
      onClick={onClick}
    >
      <App.Icon icon="chevron-right" color="#332D52" />
    </div>
  )
}

const RaffleBanner = () => {
  const { isMobile } = usePropsHelper()

  const [slide, setSlide] = useState(0)

  var settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          arrows: false,
          dots: true
        }
      },
    ],
  }

  var settingsDesktop = {
    dots: true,
    arrows: true,
    autoplay: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    customPaging: (i) => {
      return (
        <div className={cn(styles.dotWrapper, {[styles.active]: slide === i})} onClick={() => handleChangeSlide(i)}>
          <div className={styles.dot} />
        </div>
      )
    },
    beforeChange: (prev, next) => {
      setSlide(next)
    },
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          arrows: false,
          dots: true
        }
      },
    ],
  }
  
  const handleChangeSlide = (slide) => {
    setSlide(slide)
  }

  const handleButtonClick = () => {
    trackEvent('Click Get Tkeys', {
      'Source': 'Carousel',
    })

    window.open('https://galxe.com/tegro/campaign/GC9QPUMqMz?utm_source=web', '_blank')
  }

  return (
    <App.Container className={styles.container}>
      {!isMobile ? ( 
        <Slider {...settingsDesktop}>
          <div>
            <App.Flex row fullWidth>
              <App.Flex className={styles.banner1} flex={1}>
                <App.Flex column gap={3}>
                  <App.Text size={36} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>1 <App.Text inline size={24} spacing={.48} height={1} family="ClashDisplay">Collect TKeys!</App.Text></App.Text>
                  <App.Text color="rgba(255, 255, 255, 0.80)" height={1}>By completing tasks</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex className={styles.banner2} flex={1}>
                <App.Flex column gap={3}>
                  <App.Text size={36} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>2 <App.Text inline size={24} spacing={.48} height={1} family="ClashDisplay">Open Cases</App.Text></App.Text>
                  <App.Text color="rgba(255, 255, 255, 0.80)" height={1}>Using your TKeys</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex className={styles.banner3} flex={1}>
                <App.Flex column gap={3}>
                  <App.Text size={36} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>3 <App.Text inline size={24} spacing={.48} height={1} family="ClashDisplay">Earn Rewards</App.Text></App.Text>
                  <App.Text color="rgba(255, 255, 255, 0.80)" height={1}>See your luck in action</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </div>

          <div>
            <App.Flex justify="space-between" align="center" className={styles.galxeBanner}>
              <App.Flex column align="flex-start" gap={16}>
                <App.Flex gap={4}>
                  <App.Icon icon="galxe-icon" />
                  <App.Icon icon="galxe-text" />
                </App.Flex>

                <App.Text size={22} weight={500} family="ClashDisplay" gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Earn Tkeys by completing tasks</App.Text>
              </App.Flex>

              <App.Flex width={240} height={56}>
                <App.Button primary fullWidth onClick={handleButtonClick}>
                  Get TKeys
                  <App.Icon icon="galxe-icon" />
                </App.Button>
              </App.Flex>
            </App.Flex>
          </div>
        </Slider>
      ) : (
        <Slider {...settings}>
          <div>
            <App.Flex justify="space-between" align="center" className={styles.galxeBanner}>
              <App.Flex className={styles.mobileBlur} />
              <App.Flex column align="flex-start" gap={[16, 4]} sx={{zIndex: 1}}>
              <App.Text size={24} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>1</App.Text>
                <App.Text size={12} weight={500} family="ClashDisplay" color="#fff">Earn Tkeys by completing tasks</App.Text>
              </App.Flex>

              <App.Flex width={[240, 120]} height={[56, 46]}>
                <App.Button primary fullWidth onClick={handleButtonClick}>
                  Get TKeys
                  <App.Icon icon="galxe-icon" />
                </App.Button>
              </App.Flex>
            </App.Flex>
          </div>

          <div>
            <App.Flex className={styles.banner2} flex={1}>
              <App.Flex column gap={3}>
                <App.Text size={24} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>2 <App.Text inline size={14} spacing={.48} height={1} family="ClashDisplay">Open Cases</App.Text></App.Text>
                <App.Text size={12} color="rgba(255, 255, 255, 0.80)" height={1}>Using your TKeys</App.Text>
              </App.Flex>
            </App.Flex>
          </div>

          <div>
            <App.Flex className={styles.banner3} flex={1}>
              <App.Flex column gap={3}>
                <App.Text size={24} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>3 <App.Text inline size={14} spacing={.48} height={1} family="ClashDisplay">Earn Rewards</App.Text></App.Text>
                <App.Text size={12} color="rgba(255, 255, 255, 0.80)" height={1}>See your luck in action</App.Text>
              </App.Flex>
            </App.Flex>
          </div>
        </Slider>
      )}
    </App.Container>
  )
}

export default RaffleBanner