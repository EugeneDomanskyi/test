import Slider from 'react-slick'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleBanner = () => {
  const { isMobile } = usePropsHelper()

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
  }

  return (
    <App.Container className={styles.container}>
      {!isMobile ? ( 
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
      ) : (
        <Slider {...settings}>
          <div>
            <App.Flex className={styles.banner1} flex={1}>
              <App.Flex column gap={3}>
                <App.Text size={24} spacing={.72} height={1} family="ClashDisplay" sx={{ textShadow: '0px 2.85836px 2.85836px 0px rgba(0, 0, 0, 0.25)' }}>1 <App.Text inline size={14} spacing={.48} height={1} family="ClashDisplay">Collect TKeys!</App.Text></App.Text>
                <App.Text size={12} color="rgba(255, 255, 255, 0.80)" height={1}>By completing tasks</App.Text>
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