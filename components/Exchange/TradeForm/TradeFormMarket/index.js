import styles from './styles.module.scss'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'

import useTrade from '@/myhooks/trade'
import $app from '@/store/app'
import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const TradeFormMarket = ({current, currentTab, currentOption, userBalances, initialForm}) => {
  const dispatch = useDispatch()
  const { getNftPricesNative, getNftUser, getNftBids, sellPriceByAmount } = useTrade()
  const { wallet, connect, changeNetwork } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchainByCode(current?.blockchain))

  const [amount, setAmount] = useState(initialForm.amount)
  const [userNfts, setUserNfts] = useState([])
  const [onSaleNft, setOnSaleNft] = useState([])
  const [onBuyNft, setOnBuyNft] = useState([])

  const isDisabled = !(amount*1) || (currentTab === 'buy' && !onSaleNft.length)

  useEffect(() => {
    // const maxLength = currentTab === 'buy' ? onSaleNft.length : userNfts.length
    setAmount(initialForm.amount)
  }, [initialForm.amount])

  useEffect(() => {
    if (current.address) {
      getNftPricesNative(current.address).then(res => {
        setOnSaleNft(res)
      })
      getNftBids(current.address).then(res => {
        setOnBuyNft(res)
      })
      if (wallet) {
        getNftUser(current.address, wallet).then(res => {
          setUserNfts(res)
        })
      }
    }
  }, [current.address, wallet, blockchain?.code])

  useEffect(() => {
    setAmount('1')
  }, [currentTab, current.address])

  const getTotal = () => {
    if (currentTab === 'buy') {
      return onSaleNft.slice(0, amount).reduce((acc, nft) => (acc + nft.price), 0)
    }
    return sellPriceByAmount(amount, onBuyNft)
  }

  const handleChangeAmount = value => {
    const regex = /^\d+[,]?\d{0,2}$/
    if (value && !regex.test(value)) {
      return 
    }
    const maxLength = currentTab === 'buy' ? onSaleNft.length : userNfts.length
    value = value*1 > maxLength ? maxLength : value
    setAmount(value)
  }

  const handleBlurAmount = () => {
    trackEvent('Add Amount', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Amount': amount,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleChangeRange = value => {
    setAmount(value)
  }

  const handleSubmit = async () => {
    const address = await connect()
    if (!address) {
      return
    }
    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }
    const total = getTotal()
    switch (currentTab) {
      case 'buy':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/BuyModal',
          props: {
            header: {
              title: `Buy ${current.name} for ${blockchain.currency}`,
            },
            data: {
              type: 'fulfill',
              amount: amount,
              price: total / amount,
              total: total,
              items: onSaleNft.slice(0, amount).map(nft => ({token: `${current.address}:${nft.id}`, quantity: 1})),
              collectionId: current.address,
              blockchain: blockchain,
            },
          }
        }))
        break
      case 'sell':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/SellModal',
          props: {
            header: {
              title: `${userNfts.length} NFTs available`,
              subtitle: `Choose the NFT collection you want to sell`
            },
            data: {
              type: 'fulfill',
              amount: amount,
              price: total / amount,
              tokens: userNfts,
              collectionId: current.address,
              blockchain: blockchain,
            },
          }
        }))
        break
    }
  }

  return (
    <App.Flex column className={styles.form}>
      <App.Flex column sx={{marginBottom: 16}}>
        <TradeInput
          label="AMOUNT"
          value={amount}
          currency={`NFT${amount > 1 ? `s` : ''}`}
          onBlur={handleBlurAmount}
          onChange={handleChangeAmount} />
        <App.Text color="#B9B8C5" size={10} sx={{marginLeft: 'auto', marginTop: 5}}>NFTs available: {currentTab === 'buy' ? onSaleNft.length : userNfts.length}</App.Text>
      </App.Flex>
      <App.Flex sx={{marginBottom: 24}}>
        <App.RangeInput
          value={amount*1}
          min={0}
          max={currentTab === 'buy' ? onSaleNft.length : userNfts.length}
          onChange={handleChangeRange}
          containerStyle={{width: '100%'}} />
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="TOTAL"
          currency={blockchain?.currency}
          readOnly={true}
          value={getTotal()} />
        <App.Flex align="center" gap={4} className={styles.balance}>
          <App.Icon icon="wallet" />
          <App.Text color="#B9B8C5" size={10}>{ userBalances.native } { blockchain?.currency }</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Button
        sx={{backgroundColor: currentOption.color, opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'default' : 'pointer'}}
        className={styles.button}
        disabled={isDisabled}
        onClick={handleSubmit}>
        <App.Text color="#09051D" size={15} weight={700}>{ currentOption.title } {`${amount || 0} NFT${amount > 1 ? `s` : ''}` }</App.Text>
        { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
      </App.Button>
    </App.Flex>
  )
}

export default TradeFormMarket
