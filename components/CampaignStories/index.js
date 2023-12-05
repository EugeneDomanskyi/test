import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'
import Link from 'next/link'

const CampaignStories = ({onClose}) => {
  const [currentStory, setCurrentStory] = useState(0)
  const [firstProgress, setFirstProgress] = useState(0)
  const [secondProgress, setSecondProgress] = useState(0)
  const [intervalId, setIntervalId] = useState(null)

  const storyDuration = 5000

  useEffect(() => {
    startAnimation()
  }, [currentStory])

  const handleStoryChange = (index) => {
    clearInterval(intervalId)
    setCurrentStory(index)
    if (index === 0) {
      setFirstProgress(0)
      setSecondProgress(0)
    } else {
      setFirstProgress(100)
      setSecondProgress(0)

      if (index === currentStory) {
        startAnimation()
      }
    }
  }

  const startAnimation = () => {
    switch (currentStory) {
      case 1:
        const id1 = setInterval(() => {
          setSecondProgress((prevProgress) => {
            if (prevProgress === 100) {
              clearInterval(id1)
              return prevProgress
            }
            return prevProgress + 1
          })
        }, storyDuration / 100)
        setIntervalId(id1)
        break
      default:
        const id = setInterval(() => {
          setFirstProgress((prevProgress) => {
            if (prevProgress === 100) {
              clearInterval(id)
              setCurrentStory(1)
              return prevProgress
            }
            return prevProgress + 1
          })
        }, storyDuration / 100)

        setIntervalId(id)
        break
    }
  }

  return (
    <App.Flex column align="center" className={cn(styles.container, {[styles.second]: currentStory === 1})}>
      <App.Flex center className={styles.closeButton} onClick={() => onClose()}>
        <App.Icon icon="cross" color="#fff" width={10} height={10} />
      </App.Flex>

      <App.Flex className={styles.progressWrapper} gap={16}>
        <div className={styles.progressBar} onClick={() => handleStoryChange(0)}>
          <div className={styles.barFiller} style={{
              width: `${firstProgress}%`
            }} />
        </div>
        <div className={styles.progressBar} onClick={() => handleStoryChange(1)}>
          <div className={styles.barFiller} style={{
              width: `${secondProgress}%`
            }} />
        </div>
      </App.Flex>

      <App.Flex column center className={cn(styles.storyWrapper, {[styles.show]: ! currentStory})}>
        <App.Flex>
          <Image src="/animations/story_first.gif" width={320} height={320} alt="" />
        </App.Flex>

        <App.Flex column center>
          <App.Text size={36} weight={900}>
            Trade Tokens
          </App.Text>
          
          <App.Text center size={20} weight={700}>
            Buy and Sell any token on Tegro in a click. It&apos;s Superfast and Easy.
          </App.Text>
        </App.Flex>
      
        <Link href="https://blog.tegro.com/how-to-trade-on-tegro" target='_blank' onClick={onClose}>
          <App.Flex className={styles.learnButton}>
            Learn How
            <App.Icon icon="chevron-right" color="#FFD600" width={15} height={16} />
          </App.Flex>
        </Link>
      </App.Flex>

      <App.Flex column center className={cn(styles.storyWrapper, {[styles.show]: currentStory})}>
        <App.Flex sx={{marginTop: -32}}>
          <Image src="/animations/story_second.gif" width={320} height={320} alt="" />
        </App.Flex>

        <App.Flex column center>
          <App.Text size={36} weight={900}>
            Earn Rewards
          </App.Text>
          
          <App.Text center size={20} weight={600}>
            Trade Tokens, Collect TKeys, Unlock Rewards. Win $USDT, $SHIB, $PEPE, and more!
          </App.Text>
        </App.Flex>

        <Link href="/earn" onClick={onClose}>
          <App.Flex className={styles.collectButton}>Collect reward Now</App.Flex>
        </Link>
      </App.Flex>
    </App.Flex>
  )
}

export default CampaignStories