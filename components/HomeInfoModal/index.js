import { useDispatch } from 'react-redux'
import numeral from 'numeral'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'
import $modal from '@/store/modal'

import App from '@/components/App'


import styles from './styles.module.scss'

const HomeInfoModal = ({ token }) => {
  const { connect, changeNetwork, scanUrl } = useWalletConnect()
  const dispatch = useDispatch()

  const handleTrade = async (e) => {
    e.stopPropagation()
    if (token.nft20) {
      const address = await connect()
      if ( ! address) {
        return
      }

      const result = await changeNetwork(token.chain)
      if ( ! result) {
        return
      }

      dispatch($modal.set.show({modal: 'TradeModal', props: {
        token: token,
        header: {
          title: `Trade`,
        }
      }}))
    }
  }

  const handleMint = async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    const result = await changeNetwork(token.chain)
    if ( ! result) {
      return
    }

    dispatch($modal.set.show({modal: 'MintModal', props: {
      token: token,
      header: {
        title: `Mint ${token.code} NFT20`,
        subtitle: `Convert ${token.collection} NFT to ${token.code} NFT20`,
        steps: [
          { title: 'Pick NFTs', step: 0 },
          { title: 'Approve Transfer', step: 2 },
          { title: 'Mint NFT20', step: 6 },
        ],
      },
      footer: 'info',
    }}))
  }

  const handleRedeem = async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    const result = await changeNetwork(token.chain)
    if ( ! result) {
      return
    }

    dispatch($modal.set.show({modal: 'RedeemModal', props: {
      token: token,
      header: {
        title: `Redeem ${token.collection} NFTs`,
        subtitle: `Convert ${token.code} NFT20 into ${token.collection} NFTs`,
        steps: [
          { title: 'Redeem NFT20', step: 0 },
          { title: 'Successful', step: 3 },
        ],
      },
      footer: 'info',
    }}))
  }

  return (
    <App.Flex column gap={12} sx={{padding: 16}}>
      <App.Flex row align="center" gap={10}>
        <App.Text>{token.collection}</App.Text>
        <App.Text color="#B9B8C5">&bull;</App.Text>
        <App.Text color="#B9B8C5">{token.game}</App.Text>
        <App.Text color="#B9B8C5">&bull;</App.Text>
        <App.Text color="#B9B8C5">{token.code}</App.Text>
        <Image src={`/images/icon-${token.chain.toLowerCase()}.png`} width={24} height={24} alt="" />
      </App.Flex>

      <div className={styles.hr} />

      <App.Flex row align="center" justify="space-between">
        <App.Text size={12} color="#B9B8C5">Price</App.Text>
        <App.Text>{token.pool?.id ? numeral(token.price).format('$0.[0000]') : '-' }</App.Text>
      </App.Flex>

      <div className={styles.hr} />

      <App.Flex row align="center" justify="space-between">
        <App.Text size={12} color="#B9B8C5">24H Volume</App.Text>
        <App.Text>{token.pool?.id ? numeral(token.pool?.volumeToken1).format('$0.[00]') : '-'}</App.Text>
      </App.Flex>

      <div className={styles.hr} />

      <App.Flex row align="center" justify="space-between">
        <App.Text size={12} color="#B9B8C5">TVL</App.Text>
        <App.Text>{token.pool?.id ? numeral(token.tvl).format('$0.[00]') : '-'}</App.Text>
      </App.Flex>

      <App.Flex column gap={32}>
        <div className={styles.hr} />

        <App.Button primary large onClick={handleTrade}>Trade</App.Button>

        <App.Flex row>
          <App.Button variant="success" outlined group sx={{flex: 1}}onClick={handleMint}>Mint</App.Button>
          <App.Button variant="danger" outlined group sx={{flex: 1}} onClick={handleRedeem}>Redeem</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default HomeInfoModal