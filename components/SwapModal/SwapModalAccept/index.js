import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import Image from 'next/image'

import $app from '@/store/app'

import App from '@/components/App'

const SwapModalAccept = ({currency, form, collection, type, onBack, onSwap}) => {
  const blockchain = useSelector($app.get.blockchain)
  return (
    <App.Flex direction="column" align="center" sx={{padding: 40}}>
      <App.Text size={20} weight={700}>Confirm Details</App.Text>
      <App.Text color="#B9B8C5" size={14} weight={500} sx={{marginBottom: 24}}>Review the details before confirming the Swap</App.Text>
      <App.Flex sx={{width: '100%'}}>
        <App.Text flex={1} color="#B9B8C5" size={14} weight={500}>You Pay</App.Text>
        <App.Flex  width={100} />
        <App.Text flex={1} color="#B9B8C5" size={14} weight={500}>You Receive</App.Text>
      </App.Flex>
      <App.Flex sx={{width: '100%', marginBottom: 24, borderBottom: '1px solid #5E5C6B', paddingBottom: 24}} direction={type === 'buy' ? 'row' : 'row-reverse'}>
        <App.Flex flex={1} align="center" gap={4}>
          <App.Text size={16} weight={500}>{form.price}</App.Text>
          <App.Text size={16} weight={500}>{currency == 'native' ? blockchain.currency : 'USDT'}</App.Text>
          <Image src={`/images/icon-${currency == 'native' ? blockchain.code : 'usdt'}.png`} priority width={25} height={25} alt="" />
        </App.Flex>
        <App.Flex width={100} justify="center" align="center">
          <App.Icon icon="arrow-right" />
        </App.Flex>
        <App.Flex flex={1} align="center" gap={4}>
          <Image src={collection.image} priority width={25} height={25} alt="" />
          <App.Text size={16} weight={500}>{form.amount}</App.Text>
          <App.Text size={16} weight={500} lines={1}>{collection.name}</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex sx={{width: '100%', marginBottom: 24}} justify="space-between">
        <App.Text color="#B9B8C5" size={14} weight={500}>Exchange rate</App.Text>
        <App.Text>1 {collection.name} = {form.price / form.amount} {currency === 'native' ? blockchain.currency : 'USDT'}</App.Text>
      </App.Flex>
      <App.Button primary sx={{height: 56, width: 240}} onClick={onSwap}>
        Confirm Swap
      </App.Button>
      <App.Flex onClick={onBack} className={styles.backButton} gap={8}>
        <App.Icon icon="chevron-left" />
        <App.Text color="#B9B8C5" weight={500} size={16}>Go Back</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default SwapModalAccept
