import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionItemSimple = ({ item }) => {
  return (
    <App.Flex column gap={12} className={styles.container}>
      <App.Flex column justify="flex-end" className={styles.image} sx={{ backgroundImage: `url("${item.image}")` }}>
        <Image src={item.logo} width={40} height={40} alt="" />
      </App.Flex>

      <App.Text center nowrap size={9} weight={600} height={1}>{item.name}</App.Text>
      <App.Text center nowrap size={16} weight={600} height={1}>{item.currentPrice} {item.currency}</App.Text>
    </App.Flex>
  )
}

export default AuctionItemSimple