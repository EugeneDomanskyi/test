import { useRef, useState } from 'react'
import Image from 'next/image'
import Slider from 'react-slick'
import cn from 'classnames'
import { useRouter } from 'next/router'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingSlides = () => {
  const { isMobile } = usePropsHelper()
  const router = useRouter()

  const [slide, setSlide] = useState(0)

  const slideCount = isMobile ? 6 : 3
  const slider = useRef()

  const handleSlide = (index) => () => {
    setSlide(index)
    slider.current.slickGoTo(index)
  }

  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    afterChange: (index) => setSlide(index)
  }

  return (
    <App.Container className={styles.container}>
      <App.Flex column center fullWidth>

        {!isMobile ? (
          <div className={styles.slider}>
            <Slider ref={item => (slider.current = item)} {...settings}>
              <div>
                <App.Flex row className={styles.slide}>
                  <App.Flex row justify="flex-end" flex={1}>
                    <App.Flex column align="flex-end" gap={8} width={250} sx={{ margin: "145px -50px 0 0" }}>
                      <App.Text right size={20} weight={500} height={1.2}>Order Books</App.Text>
                      <App.Text right color="#B9B8C5" style="italic">Leverage market depth in real-time.</App.Text>
                    </App.Flex>

                    <App.Flex center sx={{ margin: '65px -30px 0 0' }}>
                      <Image src="/images/landing/slide-orderbook.png" width={463} height={407} alt="" />
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row flex={1}>
                    <App.Flex center sx={{ marginLeft: '-30px' }}>
                      <Image src="/images/landing/slide-form.png" width={415} height={509} alt="" />
                    </App.Flex>

                    <App.Flex column gap={8} width={250} sx={{ margin: "320px 0 0 -50px" }}>
                      <App.Text size={20} weight={500} height={1.2}>Limit Orders with Auto Order Matching</App.Text>
                      <App.Text color="#B9B8C5" style="italic">Trade ERC 20 tokens at the best price always.</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row gap={50}>
                  <App.Flex row justify="flex-end" flex={1}>
                    <App.Flex column align="flex-end" gap={8} width={250} sx={{ margin: "325px -60px 0 0" }}>
                      <App.Text right size={20} weight={500} height={1.2}>Permission Less Markets</App.Text>
                      <App.Text right color="#B9B8C5" style="italic">
                        Any token, just one search away. Discover new and trending projects, in-detail, as they emerge.
                      </App.Text>
                    </App.Flex>

                    <App.Flex center>
                      <Image src="/images/landing/slide-search.png" width={416} height={321} alt="" />
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row flex={1}>
                    <App.Flex center sx={{ marginTop: 70 }}>
                      <Image src="/images/landing/slide-order.png" width={292} height={226} alt="" />
                    </App.Flex>

                    <App.Flex column gap={8} width={250} sx={{ margin: "180px 0 0 30px" }}>
                      <App.Text size={20} weight={500} height={1.2}>Gasless Creations</App.Text>
                      <App.Text color="#B9B8C5" style="italic">Create orders without consequences & without worrying about platform fees.</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row gap={50}>
                  <App.Flex row justify="flex-end" flex={1}>
                    <App.Flex column align="flex-end" gap={8} width={260} sx={{ margin: "325px -145px 0 0" }}>
                      <App.Text right size={20} weight={500} height={1.2}>Custody Less Orders</App.Text>
                      <App.Text right color="#B9B8C5" style="italic">Your keys, your tokens. Trade confidently without giving up control over your assets</App.Text>
                    </App.Flex>

                    <App.Flex center>
                      <Image src="/images/landing/slide-order-confirm.png" width={467} height={287} alt="" />
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row flex={1}>
                    <App.Flex center sx={{ marginTop: 72 }}>
                      <Image src="/images/landing/slide-multichain2.png" width={312} height={411} alt="" />
                    </App.Flex>

                    <App.Flex column gap={8} width={250} sx={{ margin: "120px 0 0 30px" }}>
                      <App.Text size={20} weight={500} height={1.2}>Multichain Support</App.Text>
                      <App.Text color="#B9B8C5" style="italic">Any chain, we support it. One-stop-shop to trade tokens and NFTs efficiently across any blockchain.</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </div>
            </Slider>
          </div>
        ) : (
          <div className={styles.slider}>
            <Slider ref={item => (slider.current = item)} {...settings}>
              <div>
                <App.Flex row align="center" className={cn(styles.slide, { [styles.active]: slide == 0 })}>
                  <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "0 -15px 0 0" }}>
                    <App.Text right size={12} weight={600} height={1.2}>Orderbooks</App.Text>
                    <App.Text right size={10} color="#B9B8C5" style="italic">Leverage market depth in real-time. Take advantage of Token and NFT support and resistance points instantly.</App.Text>
                  </App.Flex>

                  <App.Flex center sx={{ marginRight: '-10px' }}>
                    <Image src="/images/landing/slide-orderbook.png" width={224} height={197} alt="" />
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row align="center" className={cn(styles.slide, { [styles.active]: slide == 1 })}>
                  <App.Flex center sx={{ marginLeft: '-15px' }}>
                    <Image src="/images/landing/slide-form.png" width={254} height={311} alt="" />
                  </App.Flex>

                  <App.Flex column gap={8} width={150} sx={{ margin: "0 0 0 -30px" }}>
                    <App.Text size={12} weight={600} height={1.2}>Limit Orders with Auto-Order Matching</App.Text>
                    <App.Text size={10} color="#B9B8C5" style="italic">Trade Tokens and NFTs efficiently. Use Market or Limit orders to buy and sell in bulk or to time the market better!</App.Text>
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row className={cn(styles.slide, { [styles.active]: slide == 2 })}>
                  <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "175px -40px 0 0" }}>
                    <App.Text right size={12} weight={600} height={1.2}>Permissionless Markets</App.Text>
                    <App.Text right size={10} color="#B9B8C5" style="italic">Any Token or NFT, just one search away. Discover new and trending markets, in detail, as they emerge.</App.Text>
                  </App.Flex>

                  <App.Flex center>
                    <Image src="/images/landing/slide-search.png" width={224} height={172} alt="" />
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row align="center" className={cn(styles.slide, { [styles.active]: slide == 3 })}>
                  <App.Flex center>
                    <Image src="/images/landing/slide-order.png" width={204} height={158} alt="" />
                  </App.Flex>

                  <App.Flex column gap={8} width={150} sx={{ margin: "0 0 0 10px" }}>
                    <App.Text size={12} weight={600} height={1.2}>Gasless Creations</App.Text>
                    <App.Text size={10} color="#B9B8C5" style="italic">
                      Create orders without consequences & without worrying about platform fees.
                    </App.Text>
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row className={cn(styles.slide, { [styles.active]: slide == 4 })}>
                  <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "155px -55px 0 0" }}>
                    <App.Text right size={12} weight={600} height={1.2}>Custody Less Orders</App.Text>
                    <App.Text right size={10} color="#B9B8C5" style="italic">
                      Your keys, your tokens. Trade confidently without giving up control over your Assets.
                    </App.Text>
                  </App.Flex>

                  <App.Flex center sx={{ marginTop: -50 }}>
                    <Image src="/images/landing/slide-order-confirm.png" width={224} height={137} alt="" />
                  </App.Flex>
                </App.Flex>
              </div>

              <div>
                <App.Flex row align="center" className={cn(styles.slide, { [styles.active]: slide == 5 })}>
                  <App.Flex center sx={{ marginTop: -32 }}>
                    <Image src="/images/landing/slide-multichain2.png" width={224} height={287} alt="" />
                  </App.Flex>

                  <App.Flex column gap={8} width={150} sx={{ margin: "0 0 0 10px" }}>
                    <App.Text size={12} weight={600} height={1.2}>Multichain</App.Text>
                    <App.Text size={10} color="#B9B8C5" style="italic">
                      Any chain, we support it. One-stop-shop to trade tokens on any blockchain.
                    </App.Text>
                  </App.Flex>
                </App.Flex>
              </div>
            </Slider>
          </div>
        )}

        <App.Flex center gap={12}>
          {Array(slideCount).fill(1).map((item, index) => (
            <App.Flex key={index} className={cn(styles.circle, { [styles.active]: slide == index })} onClick={handleSlide(index)}>
              <Image src={`/images/landing/dot${slide == index ? '-active' : ''}.png`} width={12} height={12} alt="" />
            </App.Flex>
          ))}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default LandingSlides