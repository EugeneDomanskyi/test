import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const SellModalConfirm = ({ token, amount }) => {
  return (
    <App.Flex column gap={32} align="center" className={styles.content}>
      <div className={styles.loader} />

      <App.Flex column gap={4}>
        <App.Text center size={20} weight={600}>Confirm Selling</App.Text>
        <App.Text center color="#B9B8C5">Proceed in your wallet</App.Text>
      </App.Flex>

      <App.Flex row center gap={8}>
        <div className={styles.imgSquare}>
          <Image src={token.image} width={25} height={25} alt="" />
        </div>

        <App.Text right size={16}>{amount} {token.collection} NFT{amount > 1 ? 's' : ''}</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default SellModalConfirm