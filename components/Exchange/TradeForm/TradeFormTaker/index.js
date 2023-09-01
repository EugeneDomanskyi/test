import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import numeral from 'numeral'

import $app from '@/store/app'
import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'
import Order from '@/libs/structs/Order'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const TradeFormTaker = forwardRef(({current, currentTab, formOption, userBalances}, ref) => {
  const { changeNetwork } = useWalletConnect()
  const dispatch = useDispatch()

  const tokenBlockchain = useSelector($app.get.blockchainByCode(current?.blockchain))

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({amount: '1', price: '0'})
  const [abilities, setAbilities] = useState({totalAmountOnSell: 0, totalAmountToSell: 0, willSpendAmount: 0, willTakeAmount: 0})

  const fetchTimeout = useRef(null)
  const previousForm = useRef({amount: '1', price: '0'})

  const isDisabled = loading
                    || (currentTab === 'buy' && !abilities.totalAmountOnSell)
                    || (currentTab === 'buy' && form.amount*1 > abilities.totalAmountOnSell*1)
                    || (currentTab === 'sell' && !abilities.totalAmountToSell)
                    || (currentTab === 'sell' && form.amount*1 > abilities.totalAmountToSell*1)

  const errors = {
    amount: (currentTab === 'buy' && (form.amount > abilities.totalAmountOnSell) || (currentTab === 'sell' && (form.amount*1 > abilities.totalAmountToSell*1))),
    balance: (currentTab === 'buy' && abilities.willSpendAmount > userBalances.usdt*1) || (currentTab === 'sell' && (form.amount*1 > userBalances.token*1)),
  }

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      setForm(data)
    }
  }))

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
    // console.log(rest)
    console.log(orders, rest)
    setAbilities(rest)
    setLoading(false)
  }

  const handleBlurAmount = () => {

  }

  const handleChangeForm = (field) => (value) => {
    const decimalRegExp = /^(?=.*\d)\d*(?:\.\d*)?$/
    if (!decimalRegExp.test(value) && value) {
      return
    }
    setForm(state => {
      return {
        ...state,
        [field]: value,
      }
    })
  }

  const handleSubmit = async () => {
    const network = await changeNetwork(tokenBlockchain.code)
    if (!network) {
      return
    }
    switch (currentTab) {
      case 'buy':
        // dispatch($modal.set.show({
        //   show: true,
        //   modal: 'Exchange/FillOrder',
        //   props: {
        //     data: {
        //       side: 'buy',
        //       makerAsset: tokenBlockchain.usdtContract,
        //       takerAsset: current.address,
        //       amount: form.amount,
        //       price: form.price,
        //       current: current,
        //       blockchain: tokenBlockchain,
        //     },
        //   }
        // }))
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
          label="AT PRICE"
          value={form.price}
          currency={'USDT'}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('price')} />
      </App.Flex>
      <App.Flex column>
        <TradeInput
          label="AMOUNT"
          value={form.amount}
          error={errors.amount}
          currency={current.symbol}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('amount')} />
        <App.Flex align="center" gap={4} className={styles.balance}>
          {
            errors.amount
              ? <App.Text color="#FF1D61" size={10} weight={500}>Amount higher than market availability</App.Text>
              : currentTab === 'sell'
                ? <Fragment>
                    <App.Icon icon="wallet" color={errors.balance ? '#FF1D61' : '#B9B8C5'} />
                    <App.Text color={errors.balance ? '#FF1D61' : '#B9B8C5'} size={10}>{numeral(userBalances.token).format('0.[0000]')} {current.symbol}</App.Text>
                  </Fragment>
                : null
          }
          <App.Text color="#B9B8C5" size={10} sx={{marginLeft: 'auto'}}>
            Available to {currentTab}:&nbsp;
            {numeral(currentTab === 'buy' ? abilities.totalAmountOnSell : abilities.totalAmountToSell).format('0.[000000]')} {current.symbol}
          </App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex flex={1} column align="center" justify="center">
        <App.Flex align="center" gap={6}>
          <App.Flex column>
            <App.Text color="#B9B8C5" size={10} weight={500} right>TOTAL</App.Text>
            <App.Text size={10} weight={700} right>USDT</App.Text>
          </App.Flex>
          <App.Text size={36} weight={600}>{numeral(currentTab === 'buy' ? abilities.willSpendAmount : abilities.willTakeAmount).format('0.0[00000]')}</App.Text>
        </App.Flex>
        {
          currentTab === 'buy'
            ? <App.Flex align="center" gap={4}>
                <App.Icon icon="wallet" color={errors.balance ? '#FF1D61' : '#B9B8C5'} />
                <App.Text color={errors.balance ? '#FF1D61' : '#B9B8C5'} size={10}>{userBalances.usdt} USDT</App.Text>
              </App.Flex>
            : null
        }
        {
          errors.balance
            ? <App.Text color="#FF1D61" size={10} weight={500}>Insufficient funds in your wallet to make this purchase</App.Text>
            : null
        }
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
