import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import numeral from 'numeral'

import useTrade from '@/myhooks/trade'
import $app from '@/store/app'
import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import Order from '@/libs/structs/Order'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const TradeFormTaker = forwardRef(({current, currentTab, formOption, userBalances}, ref) => {
  const { changeNetwork } = useWalletConnect()
  const dispatch = useDispatch()

  const tokenBlockchain = useSelector($app.get.blockchainByCode(current?.blockchain))

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({amount: '1', price: '0'})
  const [abilities, setAbilities] = useState({totalAmountOnSell: 0, totalAmountToBuy: 0, makerRate: 0, takerRate: 0, willSpendAmount: 0})

  const fetchTimeout = useRef(null)
  const previousForm = useRef({amount: '1', price: '0'})

  const isDisabled = (currentTab === 'buy' && !abilities.totalAmountOnSell) || (currentTab === 'sell' && !abilities.totalAmountToBuy) || loading

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      setForm(data)
    }
  }))

  // useEffect(() => {
  //   if (initialForm.amount*1 && initialForm.price*1) {
  //     setForm(initialForm)
  //   }
  // }, [initialForm.amount, initialForm.price])

  useEffect(() => {
    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current)
    }
    if (form.price*1 && form.amount*1 && current?.address && tokenBlockchain?.id) {
      const delay = previousForm.current.price !== form.price || previousForm.current.amount !== form.amount ? 1000 : 0
      fetchTimeout.current = setTimeout(fetchAbilities, delay)
      previousForm.current = form
    }
  }, [form.price, form.amount, current?.address, tokenBlockchain?.id, currentTab])

  const fetchAbilities = async () => {
    setLoading(true)
    const res = await Order.TOKEN.getOpenWithPriceLimitation({
      chainId: tokenBlockchain.id,
      makerAsset: currentTab === 'buy' ? current.address : tokenBlockchain.usdtContract,
      takerAsset: currentTab === 'buy' ? tokenBlockchain.usdtContract : current.address,
      amount: form.amount,
      price: form.price,
      side: currentTab,
    })
    const { orders, ...rest} = res
    console.log(orders)
    setAbilities(rest)
    setLoading(false)
  }

  const handleBlurAmount = () => {

  }

  const handleChangeForm = (field) => (value) => {
    setForm(state => {
      return {
        ...state,
        [field]: value,
      }
    })
  }

  const handleSubmit = async () => {
    // const address = await connect()
    // if (!address) {
    //   return
    // }
    const network = await changeNetwork(tokenBlockchain.code)
    if (!network) {
      return
    }
    switch (currentTab) {
      case 'buy':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/BuyModal',
          props: {
            header: {
              title: `Buy ${current.name} for USDT`,
            },
            data: {
              type: 'fulfill',
              amount: form.amount,
              price: form.price,
              total: form.amount*form.price,
              current: current,
              tokenType: 'tokens',
              blockchain: tokenBlockchain,
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
              title: `Sell ${current.name} for USDT`,
            },
            data: {
              type: 'fulfill',
              amount: form.amount,
              price: form.price,
              tokens: [],
              current: current,
              tokenType: 'tokens',
              blockchain: tokenBlockchain,
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
          label="PRICE"
          value={form.price}
          currency={'USDT'}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('price')} />
        <App.Flex align="center" gap={4} className={styles.balance}>
          <App.Icon icon="wallet" />
          <App.Text color="#B9B8C5" size={10}>{userBalances.usdt} USDT</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex column sx={{marginBottom: 16}}>
        <TradeInput
          label="AMOUNT"
          value={form.amount}
          currency={current.symbol}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('amount')} />
        <App.Flex align="center" gap={4} className={styles.balance}>
          <App.Icon icon="wallet" />
          <App.Text color="#B9B8C5" size={10}>{numeral(userBalances.token).format('0.[0000]')} {current.symbol}</App.Text>
          <App.Text color="#B9B8C5" size={10} sx={{marginLeft: 'auto'}}>
            Available: {numeral(currentTab === 'buy' ? abilities.totalAmountOnSell : abilities.totalAmountToBuy).format('0.[0000]')} {current.symbol}
          </App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex column sx={{marginBottom: 16}}>
        <TradeInput
          label="TOTAL"
          currency="USDT"
          readOnly={true}
          value={abilities.willSpendAmount} />
      </App.Flex>
      <App.Button
        sx={{backgroundColor: formOption.color, opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'default' : 'pointer'}}
        className={styles.button}
        disabled={isDisabled}
        onClick={handleSubmit}>
        <App.Text color="#09051D" size={15} weight={700}>
          { formOption.title } { form.amount } { current.symbol }
        </App.Text>
        { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
      </App.Button>
    </App.Flex>
  )
})

export default TradeFormTaker
