import { useState } from 'react'
import Image from 'next/image'
import Scrollbars from 'react-custom-scrollbars-2'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeGuide = () => {
  const { isMobile } = usePropsHelper()

  const [active, setActive] = useState('trade')
  const [step, setStep] = useState(1)

  const tabs = [
    {key: 'trade', text: 'Trade NFT20'},
    {key: 'mint', text: 'Mint NFT20'},
    {key: 'redeem', text: 'Redeem NFT'},
    {key: 'pool', text: 'Liquidity Pool'},
  ]

  const handleActiveChange = (key) => () => {
    if (key != active) {
      setActive(key)
      setStep(1)
    }
  }

  const handleStepChange = (value) => () => {
    if (value != step) {
      setStep(value)
    }
  }

  const handleGuideClick = () => {
    window.open('https://nft20-1.gitbook.io/nft-20.org/', '_blank')
  }

  return (
    <App.Container id="guide">
      <App.Flex column align="center" gap={64}>
        <App.Flex column align="center" gap={24}>
          <App.Text center size={[40, 28]} weight={700} height={1}>Step by Step Guide</App.Text>
          <App.Text center size={[20, 16]} weight={700} height={1} color="#B9B8C5">Get started with the NFT20 DEX!</App.Text>
        </App.Flex>

        <App.Flex column gap={16} width="100%">
          {isMobile ? (
            <Scrollbars
              autoHide
              autoHeight
              autoHeightMin={68}
              renderThumbVertical={props => <div {...props} className="scrollThumb" />}
              renderThumbHorizontal={props => <div {...props} className="scrollThumb" />}
            >
              <App.Flex row center={[true, false]} gap={16}>
                {tabs.map(item => (
                  <App.Flex key={item.key} center className={cn(styles.badge, {[styles.active]: active == item.key})} onClick={handleActiveChange(item.key)}>
                    <App.Text size={20} weight={700} height={1}>{item.text}</App.Text>
                  </App.Flex>
                ))}
              </App.Flex>
            </Scrollbars>
          ) : (
            <App.Flex row center={[true, false]} gap={16}>
              {tabs.map(item => (
                <App.Flex key={item.key} center className={cn(styles.badge, {[styles.active]: active == item.key})} onClick={handleActiveChange(item.key)}>
                  <App.Text size={20} weight={700} height={1}>{item.text}</App.Text>
                </App.Flex>
              ))}
            </App.Flex>
          )}

          {active == 'trade' ? (
            <App.Flex column center gap={16} className={styles.content}>
              <App.Text center size={[24, 16]} weight={700}>Swap NFT20 assets for other coins or tokens in a click.</App.Text>

              <App.Flex center>
                {step == 1 ? (
                  <video muted autoPlay width="1080" height="534">
                    <source src={`/videos/trade-1.mp4`} type="video/mp4" />
                  </video>
                ) : null}

                {step == 2 ? (
                  <video muted autoPlay width="1080" height="534">
                    <source src={`/videos/trade-2.mp4`} type="video/mp4" />
                  </video>
                ) : null}
              </App.Flex>

              <App.Flex direction={['row', 'column']} gap={16} width="100%">
                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 1})} onClick={handleStepChange(1)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 1</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Select token pair</App.Text>
                </App.Flex>

                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 2})} onClick={handleStepChange(2)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 2</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Enter & confirm amount</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}

          {active == 'mint' ? (
            <App.Flex column center gap={16} className={styles.content}>
              <App.Text center size={[24, 16]} weight={700}>Swap NFT20 assets for other coins or tokens in just a click.</App.Text>

              <App.Flex center>
                {step == 1 ? (
                  <video muted autoPlay width="1080" height="534">
                    <source src={`/videos/mint-1.mp4`} type="video/mp4" />
                  </video>
                ) : null}

                {step == 2 ? (
                  <video muted autoPlay width="1080" height="534">
                    <source src={`/videos/mint-2.mp4`} type="video/mp4" />
                  </video>
                ) : null}
              </App.Flex>

              <App.Flex direction={['row', 'column']} gap={16} width="100%">
                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 1})} onClick={handleStepChange(1)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 1</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Deposit NFT asset</App.Text>
                </App.Flex>

                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 2})} onClick={handleStepChange(2)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 2</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Convert to NFT20 token</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}

          {active == 'redeem' ? (
            <App.Flex column center gap={16} className={styles.content}>
              <App.Text center size={[24, 16]} weight={700}>Swap NFT20 assets for other coins or tokens in just a click.</App.Text>

              <App.Flex center>
                {step == 1 ? (
                  <video muted autoPlay width="1080" height="534">
                    <source src={`/videos/redeem-1.mp4`} type="video/mp4" />
                  </video>
                ) : null}

                {step == 2 ? (
                  <video muted autoPlay width="1080" height="534">
                    <source src={`/videos/redeem-2.mp4`} type="video/mp4" />
                  </video>
                ) : null}
              </App.Flex>

              <App.Flex direction={['row', 'column']} gap={16} width="100%">
                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 1})} onClick={handleStepChange(1)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 1</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Deposit NFT20 token</App.Text>
                </App.Flex>

                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 2})} onClick={handleStepChange(2)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 2</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Convert to NFT asset</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}

          {active == 'pool' ? (
            <App.Flex column center gap={16} className={styles.content}>
              <App.Text center size={[24, 16]} weight={700}>Add Liquidity to pools and start earning fees.</App.Text>

              <App.Flex center sx={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%' }}>
                <Image src="/images/trade-1.png" fill alt="" />
              </App.Flex>

              <App.Flex direction={['row', 'column']} gap={16} width="100%">
                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 1})} onClick={handleStepChange(1)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 1</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Deposit Token Pair</App.Text>
                </App.Flex>

                <App.Flex column gap={8} flex={1} className={cn(styles.step, {[styles.active]: step == 2})} onClick={handleStepChange(2)}>
                  <App.Text size={[20, 16]} weight={700} height={1}>Step 2</App.Text>
                  <App.Text size={[24, 20]} weight={700} height={1}>Create Liquidity Position</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}
        </App.Flex>

        <App.Flex row center gap={8} onClick={handleGuideClick} sx={{ cursor: 'pointer' }}>
          <App.Text inline size={16} weight={700}>Have more questions?</App.Text>
          <App.Text inline size={16} color="#B9B8C5">We have a guide</App.Text>
          <App.Icon icon="arrow-right" />
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeGuide