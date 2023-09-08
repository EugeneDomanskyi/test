import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingSlides = () => {
  const { isMobile } = usePropsHelper()

  const [slide, setSlide] = useState(0)

  const timer = useRef()

  const slideCount = isMobile ? 7 : 4

  useEffect(() => {
    setSlide(0)
    timer.current = setInterval(() => {
      setSlide(slide => {
        return slide < (slideCount - 1) ? (slide * 1 + 1) : 0
      })
    }, 3000)

    return () => {
      clearInterval(timer.current)
    }
  }, [isMobile])

  const handleSlide = (index) => () => {
    clearInterval(timer.current)
    setSlide(index)
  }

  return (
    <App.Container className={styles.container}>
      <App.Flex column center fullWidth>
        <App.Flex width={['40%', '60%']}>
          <App.Text center size={[64, 24]} weight={800} height={1.2}>The Ease of CEX, Now in a DEX</App.Text>
        </App.Flex>

        {!isMobile ? (
          <App.Flex row fullWidth className={styles.slider}>
            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 0})}>
              <App.Flex row justify="flex-end" flex={1}>
                <App.Flex column align="flex-end" gap={8} width={250} sx={{ margin: "145px -50px 0 0" }}>
                  <App.Text right size={20} weight={600} height={1.2}>Orderbooks</App.Text>
                  <App.Text right color="#B9B8C5" style="italic">Leverage market depth in real-time. Take advantage of Token and NFT support and resistance points instantly.</App.Text>
                </App.Flex>

                <App.Flex center sx={{ margin: '65px -30px 0 0' }}>
                  <Image src="/images/landing/slide-orderbook.png" width={441} height={449} alt="" />
                </App.Flex>
              </App.Flex>

              <App.Flex row flex={1}>
                <App.Flex center sx={{ marginLeft: '-30px' }}>
                  <Image src="/images/landing/slide-form.png" width={415} height={509} alt="" />
                </App.Flex>

                <App.Flex column gap={8} width={250} sx={{ margin: "320px 0 0 -50px" }}>
                  <App.Text size={20} weight={600} height={1.2}>Limit Orders with Auto-Order Matching</App.Text>
                  <App.Text color="#B9B8C5" style="italic">Trade Tokens and NFTs efficiently. Use Market or Limit orders to buy and sell in bulk or to time the market better!</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex row gap={50} className={cn(styles.slide, {[styles.active]: slide == 1})}>
              <App.Flex row justify="flex-end" flex={1}>
                <App.Flex column align="flex-end" gap={8} width={250} sx={{ margin: "325px -60px 0 0" }}>
                  <App.Text right size={20} weight={600} height={1.2}>Permissionless Markets</App.Text>
                  <App.Text right color="#B9B8C5" style="italic">Any Token or NFT, just one search away. Discover new and trending markets, in detail, as they emerge.</App.Text>
                </App.Flex>

                <App.Flex center>
                  <Image src="/images/landing/slide-search.png" width={416} height={321} alt="" />
                </App.Flex>
              </App.Flex>

              <App.Flex row flex={1}>
                <App.Flex center sx={{ marginTop: 70 }}>
                  <Image src="/images/landing/slide-order.png" width={292} height={250} alt="" />
                </App.Flex>

                <App.Flex column gap={8} width={250} sx={{ margin: "165px 0 0 30px" }}>
                  <App.Text size={20} weight={600} height={1.2}>Gasless Orders</App.Text>
                  <App.Text color="#B9B8C5" style="italic">Trade with confidence! Create orders without ever having to worry about incurring gas fees.</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex row gap={50} className={cn(styles.slide, {[styles.active]: slide == 2})}>
              <App.Flex row justify="flex-end" flex={1}>
                <App.Flex column align="flex-end" gap={8} width={260} sx={{ margin: "325px -145px 0 0" }}>
                  <App.Text right size={20} weight={600} height={1.2}>Non-Custody Orders</App.Text>
                  <App.Text right color="#B9B8C5" style="italic">Your Keys, Your Assets. Trade Tokens and NFTs securely without giving up control over them!</App.Text>
                </App.Flex>

                <App.Flex center>
                  <Image src="/images/landing/slide-order-confirm.png" width={467} height={287} alt="" />
                </App.Flex>
              </App.Flex>

              <App.Flex row flex={1}>
                <App.Flex center sx={{ marginTop: 5 }}>
                  <Image src="/images/landing/slide-multichain.png" width={312} height={279} alt="" />
                </App.Flex>

                <App.Flex column gap={8} width={250} sx={{ margin: "120px 0 0 30px" }}>
                  <App.Text size={20} weight={600} height={1.2}>Multichain Support</App.Text>
                  <App.Text color="#B9B8C5" style="italic">Any chain, we support it. One-stop-shop to trade tokens and NFTs efficiently across any blockchain.</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 3})}>
              <App.Flex row gap={20} justify="center" flex={1}>
                <App.Flex column align="flex-end" gap={8} width={260} sx={{ margin: "110px 0 0 0" }}>
                  <App.Text right size={20} weight={600} height={1.2}>Access Global Liquidity</App.Text>
                  <App.Text right color="#B9B8C5" style="italic">The entire market’s liquidity at your fingertips! Enjoy deep liquidity for any Token and NFT out there.</App.Text>
                </App.Flex>

                <App.Flex center>
                  <Image src="/images/landing/slide-orderbook-full.png" width={379} height={322} alt="" />
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        ) : (
          <App.Flex row fullWidth className={styles.slider}>
            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 0})}>
              <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "55px -30px 0 0" }}>
                <App.Text right size={12} weight={600} height={1.2}>Orderbooks</App.Text>
                <App.Text right size={10} color="#B9B8C5" style="italic">Leverage market depth in real-time. Take advantage of Token and NFT support and resistance points instantly.</App.Text>
              </App.Flex>

              <App.Flex center sx={{ marginRight: -10 }}>
                <Image src="/images/landing/slide-orderbook.png" width={254} height={289} alt="" />
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 1})}>
              <App.Flex center sx={{ marginLeft: '-15px' }}>
                <Image src="/images/landing/slide-form.png" width={254} height={311} alt="" />
              </App.Flex>

              <App.Flex column gap={8} width={150} sx={{ margin: "150px 0 0 -30px" }}>
                <App.Text size={12} weight={600} height={1.2}>Limit Orders with Auto-Order Matching</App.Text>
                <App.Text size={10} color="#B9B8C5" style="italic">Trade Tokens and NFTs efficiently. Use Market or Limit orders to buy and sell in bulk or to time the market better!</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 2})}>
              <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "175px -40px 0 0" }}>
                <App.Text right size={12} weight={600} height={1.2}>Permissionless Markets</App.Text>
                <App.Text right size={10} color="#B9B8C5" style="italic">Any Token or NFT, just one search away. Discover new and trending markets, in detail, as they emerge.</App.Text>
              </App.Flex>

              <App.Flex center>
                <Image src="/images/landing/slide-search.png" width={224} height={172} alt="" />
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 3})}>
              <App.Flex center>
                <Image src="/images/landing/slide-order.png" width={204} height={174} alt="" />
              </App.Flex>

              <App.Flex column gap={8} width={150} sx={{ margin: "60px 0 0 10px" }}>
                <App.Text size={12} weight={600} height={1.2}>Gasless Orders</App.Text>
                <App.Text size={10} color="#B9B8C5" style="italic">Trade with confidence! Create orders without ever having to worry about incurring gas fees.</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 4})}>
              <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "155px -55px 0 0" }}>
                <App.Text right size={12} weight={600} height={1.2}>Non-Custody Orders</App.Text>
                <App.Text right size={10} color="#B9B8C5" style="italic">Your Keys, Your Assets. Trade Tokens and NFTs securely without giving up control over them!</App.Text>
              </App.Flex>

              <App.Flex center sx={{ marginTop: -50 }}>
                <Image src="/images/landing/slide-order-confirm.png" width={224} height={137} alt="" />
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 5})}>
              <App.Flex center>
                <Image src="/images/landing/slide-multichain.png" width={204} height={182} alt="" />
              </App.Flex>

              <App.Flex column gap={8} width={150} sx={{ margin: "55px 0 0 10px" }}>
                <App.Text size={12} weight={600} height={1.2}>Multichain Support</App.Text>
                <App.Text size={10} color="#B9B8C5" style="italic">Any chain, we support it. One-stop-shop to trade tokens and NFTs efficiently across any blockchain.</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row className={cn(styles.slide, {[styles.active]: slide == 6})}>
              <App.Flex column align="flex-end" gap={8} width={150} sx={{ margin: "70px 0 0 0" }}>
                <App.Text right size={12} weight={600} height={1.2}>Access Global Liquidity</App.Text>
                <App.Text right size={10} color="#B9B8C5" style="italic">The entire market’s liquidity at your fingertips! Enjoy deep liquidity for any Token and NFT out there.</App.Text>
              </App.Flex>

              <App.Flex center>
                <Image src="/images/landing/slide-orderbook-full.png" width={204} height={173} alt="" />
              </App.Flex>
            </App.Flex>
          </App.Flex>
        )}

        <App.Flex center gap={12}>
          {Array(slideCount).fill(1).map((item, index) => (
            <App.Flex key={index} className={cn(styles.circle, {[styles.active]: slide == index})} onClick={handleSlide(index)}>
            <Image src={`/images/landing/dot${slide == index ? '-active' : ''}.png`} width={12} height={12} alt="" />
            </App.Flex>
          ))}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default LandingSlides