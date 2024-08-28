import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotTabs = () => {
  const router = useRouter()
  const [_, bot, page] = router.asPath.split('/')
  const currentPage = page ?? 'auctions'

  const handlePage = (page) => () => {
    router.push(`/bot${page !== '' ? ('/' + page) : page}`)
  } 

  return (
    <App.Flex row className={styles.container}>
      <App.Flex column align="center" flex={1} className={cn(styles.tab, {[styles.active]: currentPage == 'shop'})} onClick={handlePage('shop')}>
        <App.Flex fullWidth height={48} column justify="flex-end" align="center">
          <Image src="/images/bot/shop.png" width={48} height={37} />
        </App.Flex>
        <App.Text size={13} weight={400} color="#fff">Shop</App.Text>
      </App.Flex>

      <App.Flex column align="center" flex={1} className={cn(styles.tab, {[styles.active]: currentPage == 'auctions'})} onClick={handlePage('')}>
        <App.Flex fullWidth height={48} column justify="flex-end" align="center">
          <Image src="/images/bot/auction.png" width={53} height={48} />
        </App.Flex>
        <App.Text size={13} weight={400} color="#fff">Auctions</App.Text>
      </App.Flex>

      <App.Flex column align="center" flex={1} className={cn(styles.tab, {[styles.active]: currentPage == 'earn'})} onClick={handlePage('earn')}>
        <App.Flex fullWidth height={48} column justify="flex-end" align="center">
          <Image src="/images/bot/earn.png" width={48} height={37} />
        </App.Flex>
        <App.Text size={13} weight={400} color="#fff">Earn</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default BotTabs