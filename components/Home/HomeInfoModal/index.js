import { useDispatch, useSelector } from 'react-redux'
import numeral from 'numeral'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'
import $modal from '@/store/modal'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeInfoModal = ({ collection }) => {
  const { connect } = useWalletConnect()
  const dispatch = useDispatch()
  const { blockchain } = useSelector(({ $app }) => $app)

  const handleSwap = (collection) => async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    dispatch($modal.set.show({modal: 'SwapModal', props: {
      collection,
      header: {
        title: `Swap`,
      },
    }}))
  }

  return (
    <App.Flex column gap={12} sx={{padding: 16}}>
      <App.Flex row align="center" gap={10}>
        <App.Text>{collection.name}</App.Text>
        <App.Text color="#B9B8C5">&bull;</App.Text>
        <App.Text color="#B9B8C5">{collection.slug}</App.Text>
        <Image src={`/images/icon-${blockchain}.png`} width={24} height={24} alt="" />
      </App.Flex>

      <div className={styles.hr} />

      <App.Flex row align="center" justify="space-between">
        <App.Text size={12} color="#B9B8C5">Price</App.Text>
        <App.Text>{collection.price ? numeral(collection.price).format('$0.[0000]') : '-' }</App.Text>
      </App.Flex>

      <div className={styles.hr} />

      <App.Flex row align="center" justify="space-between">
        <App.Text size={12} color="#B9B8C5">24H Volume</App.Text>
        <App.Text>{collection.volume ? numeral(collection.volume).format('$0.[00]') : '-'}</App.Text>
      </App.Flex>

      <div className={styles.hr} />

      <App.Flex row align="center" justify="space-between">
        <App.Text size={12} color="#B9B8C5">TVL</App.Text>
        <App.Text>{collection.tvl ? numeral(collection.tvl).format('$0.[00]') : '-'}</App.Text>
      </App.Flex>

      <App.Flex column gap={32}>
        <div className={styles.hr} />

        <App.Button primary large onClick={handleSwap}>Swap</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default HomeInfoModal