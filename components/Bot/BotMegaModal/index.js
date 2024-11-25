import { useDispatch, useSelector } from 'react-redux'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotMegaModal = () => {
  const dispatch = useDispatch()
  const megaModal = useSelector(({ $bot }) => $bot.megaModal)

  const handleClose = () => {
    dispatch($bot.set.megaModal(false))
  }

  const handleTab = (tab) => () => {
    dispatch($bot.set.tab(tab))
    handleClose()
  }

  return (
    <App.Dialog visible hideHeader open={megaModal} onClose={handleClose}>
      <App.Flex fullWidth className={styles.container}>
        <App.Flex className={styles.tiger}/>

        <App.Flex column fullWidth className={styles.inner}>
          <App.Flex fullWidth align="center" className={styles.header}>
            <App.Text center size={20} weight={700} height={1}>Oops! You’re not eligible</App.Text>

            <App.Flex center className={styles.close} onClick={handleClose}>
              <App.Icon icon="cross" color="#fff" />
            </App.Flex>
          </App.Flex>

          <App.Flex column fullWidth gap={16} className={styles.body}>
            <App.Flex column fullWidth gap={8} sx={{padding: '0 8px'}}>
              <App.Text size={14} weight={700} height={1}>To qualify for Mega Auctions:</App.Text>

              <App.Text size={14} weight={400}>You should have purchased at least 100,000 gems from the shop in the last 7 days.</App.Text>
              <App.Text center size={14} weight={400}>OR</App.Text>
              <App.Text size={14} weight={400}>Purchased 500,000 gems in the last 30 days.</App.Text>
            </App.Flex>

            <App.Flex column align="flex-start" gap={8} justify="center" className={styles.blueBox}>
              <App.Text size={16} weight={700}>Buy Gems from the Shop</App.Text>
              <App.Button variant="bot" small onClick={handleTab('shop')}>Buy now</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Dialog>
  )
}

export default BotMegaModal