import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'
import CampaignStories from '@/components/CampaignStories'

const StoriesButton = () => {
  const router = useRouter()

  const [show, setShow] = useState(false)

  const isSeen = false

  useEffect(() => {
    if (router.query.src) {
      setShow(true)
    }
  }, [router.query?.src])

  return (
    <>
      <App.Flex column className={cn(styles.container, {[styles.disabled]: isSeen})} onClick={() => setShow(!show)}>
        <App.Flex center className={styles.outerCircle} />

        <App.Flex center className={styles.innerCircle}>
          <Image src="/images/raffle/tkey-medium.png" width={20} height={20} alt="" />
        </App.Flex>
      </App.Flex>

      {
        show
          ? <>
              <App.Flex className={styles.outsideClose} onClick={() => setShow(false)} />
              <CampaignStories onClose={() => setShow(false)} />
            </>
          : null
      }
    </>
  )
}

export default StoriesButton