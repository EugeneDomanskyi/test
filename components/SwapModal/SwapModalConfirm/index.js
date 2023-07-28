import { useSelector } from 'react-redux'
import Image from 'next/image'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwapModalConfirm = ({ collection, currency, type, nfts }) => {
  const blockchain = useSelector($app.get.blockchain)

  return (
    <App.Flex column gap={32} align="center" className={styles.content}>
      <div className={styles.loader} />

      <App.Flex column gap={4}>
        <App.Text center size={20} weight={600}>Confirm Swap</App.Text>
        <App.Text center color="#B9B8C5">Proceed in your wallet</App.Text>
      </App.Flex>

      {type == 'buy' ? (
        <App.Flex row center gap={8}>
          <div className={styles.imgRound}>
            <Image src={`/images/icon-${(currency == 'native' ? blockchain.code : 'usdt')}.png`} width={25} height={25} alt="" />
          </div>

          <App.Text size={16}>{currency == 'native' ? blockchain.currency : 'USDT'}</App.Text>

          <App.Icon icon="arrow-right" />
          
          <div className={styles.imgSquare}>
            <Image src={collection.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={16}>{nfts.length} {collection.name} NFT{nfts.length > 1 ? 's' : ''}</App.Text>
        </App.Flex>
      ) : (
        <App.Flex row center gap={8}>
          <div className={styles.imgSquare}>
            <Image src={collection.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={16}>{nfts.length} {collection.name} NFT{nfts.length > 1 ? 's' : ''}</App.Text>

          <App.Icon icon="arrow-right" />

          <div className={styles.imgRound}>
            <Image src={`/images/icon-${(currency == 'native' ? blockchain.code : 'usdt')}.png`} width={25} height={25} alt="" />
          </div>

          <App.Text size={16}>{currency == 'native' ? blockchain.currency : 'USDT'}</App.Text>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default SwapModalConfirm