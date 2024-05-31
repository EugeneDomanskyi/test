import App from 'components/App'

import styles from './styles.module.scss'
import Image from 'next/image'

const AuctionLoader = () => {
  return (
    <App.Flex center className={styles.loader}>
      <Image src="/images/bid-loader.png" width={80} height={80} alt="" />
    </App.Flex>
  )
}

export default AuctionLoader