import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'

import $app from '@/store/app'
import $modal from '@/store/modal'
import $orders from '@/store/orders'
import useWalletConnect from '@/myhooks/wallet-connect'
import Order from '@/libs/structs/Order'
import { INCH_TOKENS } from '@/config'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const fmt = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: ''
}

BigNumber.config({ FORMAT: fmt })

const TradeFormTaker = forwardRef(({current, currentTab, formOption, userBalances}, ref) => {
  const { changeNetwork } = useWalletConnect()
  const dispatch = useDispatch()
  const router = useRouter()

  const tokenBlockchain = useSelector($app.get.blockchainByCode(current?.blockchain))
  const orderBook = useSelector($orders.get.orderBook('tokens'))

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({amount: '1', price: '0'})
  const [abilities, setAbilities] = useState({totalAmountOnSell: 0, totalAmountToSell: 0, willSpendAmount: 0, willTakeAmount: 0})

  const fetchTimeout = useRef(null)
  const previousForm = useRef({amount: '1', price: '0'})

  const errors = {
    amount: (currentTab === 'buy' && (form.amount*1 > abilities.totalAmountOnSell*1) || (currentTab === 'sell' && (form.amount*1 > abilities.totalAmountToSell*1))),
    balance: (currentTab === 'buy' && abilities.willSpendAmount > userBalances.usdt*1) || (currentTab === 'sell' && (form.amount*1 > userBalances.token*1)),
  }

  const isDisabled = loading
                    || (currentTab === 'buy' && !abilities.totalAmountOnSell)
                    || (currentTab === 'sell' && !abilities.totalAmountToSell)
                    || errors.balance
                    || errors.amount

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      handleChangeForm('price')(data.price.toString())
      handleChangeForm('amount')(data.amount.toString())
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

  useEffect(() => {
    if (current?.address && router.query?.segments?.[1] === current?.address) {
      if (currentTab === 'buy' && orderBook.sell.length) {
        handleSetPrice()
      }
      if (currentTab === 'sell' && orderBook.buy.length) {
        handleSetPrice()
      }
    }
  }, [orderBook.buy.length, orderBook.sell.length, current?.address, router.query?.segments])

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
    const { orders, ...rest } = res
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
    if (field === 'price') {
      value = value.substring(0, value.indexOf('.') + 7)
    }
    setForm(state => {
      return {
        ...state,
        [field]: value,
      }
    })
  }

  const handleSetPrice = () => {
    switch (currentTab) {
      case 'buy':
        const [cheapestOrder] = orderBook.sell
        handleChangeForm('price')(cheapestOrder.priceFormatted.toString())
        handleChangeForm('amount')(cheapestOrder.amount.toString())
        break
      case 'sell':
        const [expensiveOrder] = orderBook.buy
        handleChangeForm('price')(expensiveOrder.priceFormatted.toString())
        handleChangeForm('amount')(expensiveOrder.amount.toString())
        break
    }
  }

  const handleSubmit = async () => {
    const network = await changeNetwork(tokenBlockchain.code)
    if (!network) {
      return
    }
    const usdtAsset = INCH_TOKENS[tokenBlockchain.usdtContract.toLowerCase()]
    const usdtFormatted = {
      ...usdtAsset,
      image: usdtAsset.logoURI,
    }
    switch (currentTab) {
      case 'buy':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/FillOrder',
          props: {
            data: {
              side: 'buy',
              makerAsset: current,
              takerAsset: usdtFormatted,
              amount: form.amount,
              price: form.price,
              blockchain: tokenBlockchain,
            },
          }
        }))
        break
      case 'sell':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/FillOrder',
          props: {
            data: {
              side: 'sell',
              makerAsset: usdtFormatted,
              takerAsset: current,
              amount: form.amount,
              price: form.price,
              blockchain: tokenBlockchain,
            },
          }
        }))
        break
    }
  }
  
  return (
    <App.Flex column className={styles.form}>
      <App.Flex column sx={{marginBottom: 16, position: 'relative'}} justify="center">
        <TradeInput
          label="AT PRICE"
          value={form.price}
          currency={'USDT'}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('price')} />
        <App.Flex className={styles.priceSetter} onClick={handleSetPrice}>
          <App.Text size={12} weight={600} color={currentTab === 'buy' ? '#53F19C' : '#FF1D61'}>
            { currentTab === 'buy' ? 'LOWEST PRICE' : 'HIGHEST PRICE' }
          </App.Text>
        </App.Flex>
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
            {new BigNumber(currentTab === 'buy' ? abilities.totalAmountOnSell : abilities.totalAmountToSell).toFormat()} {current.symbol}
          </App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex flex={1} column align="center" justify="center">
        <App.Flex align="center" gap={6}>
          <App.Flex column>
            <App.Text color="#B9B8C5" size={10} weight={500} right>TOTAL</App.Text>
            <App.Text size={10} weight={700} right>USDT</App.Text>
          </App.Flex>
          <App.Text size={36} weight={600}>{new BigNumber(currentTab === 'buy' ? abilities.willSpendAmount : abilities.willTakeAmount).toFixed()}</App.Text>
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
