import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetOnce = ({ onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <App.Flex column gap={[64, 32]} sx={[{ padding: 32 }, { padding: 16 }]}>
      <App.Flex column center gap={16}>
        <App.Text center size={24} weight={600}>Gotta Trade ‘Em All!</App.Text>
        <App.Flex row center sx={[{ padding: '0 48px' }, {padding: 0}]}>
          <App.Text center weight={400} color="rgba(255, 255, 255, 0.60)">Congratulations! Here’s your FREE Testnet Tokens. You can begin TRADING them right away!</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex direction={['row', 'column']} fullWidth gap={32}>
        <App.Flex column center gap={32} className={cn(styles.box, styles.kryptonite)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-kryptonite.png" width={100} height={100} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>1M KRYPTONITE</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column center gap={32} className={cn(styles.box, styles.pokeballs)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-pokeballs.png" width={100} height={100} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>1M POKEBALLS</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex center row gap={[32, 16]} sx={[{ padding: '0 48px' }, {padding: 0}]}>
        <App.Flex center flex={1}>
          <App.Button primary outlined large fullWidth>Share Now</App.Button>
        </App.Flex>

        <App.Flex center flex={1}>
          <App.Button primary large fullWidth onClick={handleClose}>Start Trading</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetOnce