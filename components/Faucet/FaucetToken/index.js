import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import Contracts from '@/libs/contracts.lib'

import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetToken = ({ onComplete }) => {
  const dispatch = useDispatch()

  const [tokenId, setTokenId] = useState()

  const contracts = new Contracts()

  const handleClaim = async () => {
    if (tokenId) {
      const result = await contracts.getFreeToken(process.env.NEXT_PUBLIC_FAUCET_CONTRACT, tokenId)
      if (result?.error) {
        if (result.error.includes('reason:')) {
          const temp = result.error.split('reason:')
          if (temp.length == 2) {
            dispatch($alert.set.error({ title: 'An Error Occurred', text: temp[1] }))
          }
        }

        return
      }

      if (onComplete) (
        onComplete()
      )
    }
  }

  const handleTokenId = (id) => () => {
    setTokenId(id)
  }

  return (
    <App.Flex column align="center" justify="space-between" className={styles.container}>
      <App.Flex center column gap={[16, 8]}>
        <App.Text center size={24} weight={600} height={1}>Claim Token</App.Text>
        <App.Text center weight={400} color="#B9B8C5">Collect the tokens and start trading on Tegro testnet</App.Text>
      </App.Flex>

      <App.Flex direction={['row', 'column']} center fullWidth gap={16}>
        <App.Flex direction={['column', 'row']} center gap={32} onClick={handleTokenId('BTC')} className={cn(styles.box, {[styles.active]: tokenId == 'BTC'}, styles.btc)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-btc.png" width={70} height={70} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>0.0023 BTC</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex direction={['column', 'row']} center gap={32} onClick={handleTokenId('ETH')} className={cn(styles.box, {[styles.active]: tokenId == 'ETH'}, styles.eth)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-eth.png" width={70} height={70} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>0.044 ETH</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex direction={['column', 'row']} center gap={32} onClick={handleTokenId('USDT')} className={cn(styles.box, {[styles.active]: tokenId == 'USDT'}, styles.usdt)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-usdt.png" width={70} height={70} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>100 USDT</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={16}>
        <App.Button primary xl fitWidth center disabled={!tokenId} onClick={handleClaim}>Claim Token</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetToken