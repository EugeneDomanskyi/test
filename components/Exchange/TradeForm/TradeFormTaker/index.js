import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
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
  const { changeNetwork, wallet } = useWalletConnect()
  const dispatch = useDispatch()
  const router = useRouter()

  const tokenBlockchain = useSelector($app.get.blockchainByCode(current?.blockchain))
  const orderBook = useSelector($orders.get.orderBook('tokens'))

  const [loading, setLoading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
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
    setShowErrors(false)
  }, [current?.address])

  useEffect(() => {
    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current)
    }
    if (form.price*1 && form.amount*1 && current?.address && tokenBlockchain?.id) {
      const delay = previousForm.current.price !== form.price || previousForm.current.amount !== form.amount ? 1000 : 0
      fetchTimeout.current = setTimeout(fetchAbilities, delay)
      previousForm.current = form
    } else if (!(form.price*1) || !(form.amount*1)) {
      setAbilities({totalAmountOnSell: 0, totalAmountToSell: 0, willSpendAmount: 0, willTakeAmount: 0})
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
    setShowErrors(true)
  }

  const handleChangeForm = (field) => (value) => {
    const decimalRegExp = /^(?=.*\d)\d*(?:\.\d*)?$/
    if (!decimalRegExp.test(value) && value) {
      return
    }
    setForm(state => {
      return {
        ...state,
        [field]: value.substring(0, value.indexOf('.') + 7),
      }
    })
  }

  const handleSetPrice = () => {
    switch (currentTab) {
      case 'buy':
        const [cheapestOrder] = orderBook.sell
        if (cheapestOrder) {
          handleChangeForm('price')(cheapestOrder.priceFormatted.toString())
          handleChangeForm('amount')(cheapestOrder.amount.toString())
        }
        break
      case 'sell':
        const [expensiveOrder] = orderBook.buy
        if (expensiveOrder) {
          handleChangeForm('price')(expensiveOrder.priceFormatted.toString())
          handleChangeForm('amount')(expensiveOrder.amount.toString())
        }
        
        break
    }
  }

  const handleMultiply = percentage => () => {
    switch (currentTab) {
      case 'buy':
        handleChangeForm('amount')((abilities.totalAmountOnSell*percentage).toString())
        break
      case 'sell':
        handleChangeForm('amount')((userBalances.token*percentage).toString())
        break
    }
  }

  const handleSubmit = async () => {
    const network = await changeNetwork(tokenBlockchain.code)
    if (!network) {
      return
    }
    if (isDisabled) {
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
          error={errors.amount && showErrors}
          currency={current.symbol}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('amount')} />
        <App.Flex className={styles.multiplerContainer}>
          {
            currentTab === 'sell'
              ? <App.Flex flex={1} align="center" className={styles.balance}>
                  <App.Icon icon="wallet" color={errors.balance ? '#FF1D61' : '#B9B8C5'} style={{marginLeft: 8, marginRight: 5}} />
                  <App.Text color={errors.balance ? '#FF1D61' : '#B9B8C5'} size={10}>{numeral(userBalances.token).format('0.[0000]')} {current.symbol}</App.Text>
                </App.Flex>
              : <App.Flex flex={1} />
          }
          <App.Flex flex={1} className={styles.multipler}>
            <App.Flex flex={1} align="center" justify="center" sx={{cursor: 'pointer'}} onClick={handleMultiply(0.25)}>
              <App.Text color="#B9B8C5" size={10} weight={600}>25%</App.Text>
            </App.Flex>
            <App.Flex flex={1} align="center" justify="center" sx={{cursor: 'pointer'}} onClick={handleMultiply(0.5)}>
              <App.Text color="#B9B8C5" size={10} weight={600}>50%</App.Text>
            </App.Flex>
            <App.Flex flex={1} align="center" justify="center" sx={{cursor: 'pointer'}} onClick={handleMultiply(0.75)}>
              <App.Text color="#B9B8C5" size={10} weight={600}>75%</App.Text>
            </App.Flex>
            <App.Flex flex={1} align="center" justify="center" sx={{cursor: 'pointer'}} onClick={handleMultiply(1)}>
              <App.Text color="#B9B8C5" size={10} weight={600}>100%</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
        <App.Flex align="center" gap={4} className={{}}>
          {
            loading
              ? <App.Loader size={15} />
              : errors.amount && showErrors
                ? <App.Text color="#FF1D61" size={10} weight={500}>Amount higher than market availability</App.Text>
                : null
          }
          <App.Text color="#B9B8C5" size={10} sx={{marginLeft: 'auto'}}>
            Available to {currentTab}:&nbsp;
            { currentTab === 'buy' ? abilities.totalAmountOnSell : abilities.totalAmountToSell } {current.symbol}
          </App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex flex={1} column align="center" justify="center">
        <App.Flex align="center" gap={6}>
          <App.Flex column>
            <App.Text color="#B9B8C5" size={10} weight={500} right>TOTAL</App.Text>
            <App.Text size={10} weight={700} right>USDT</App.Text>
          </App.Flex>
          <App.Text size={36} weight={600}>
            { currentTab === 'buy' ? abilities.willSpendAmount : abilities.willTakeAmount }
          </App.Text>
        </App.Flex>
        {
          currentTab === 'buy'
            ? <App.Flex align="center" gap={4}>
                <App.Icon icon="wallet" color={errors.balance && showErrors ? '#FF1D61' : '#B9B8C5'} />
                <App.Text color={errors.balance && showErrors ? '#FF1D61' : '#B9B8C5'} size={10}>{userBalances.usdt} USDT</App.Text>
              </App.Flex>
            : null
        }
        {
          errors.balance && showErrors
            ? <App.Text color="#FF1D61" size={10} weight={500}>Insufficient funds in your wallet to make this purchase</App.Text>
            : null
        }
      </App.Flex>
      <App.Button
        sx={{backgroundColor: formOption.color, opacity: isDisabled && wallet ? 0.5 : 1, cursor: isDisabled && wallet ? 'default' : 'pointer'}}
        className={styles.button}
        disabled={isDisabled && wallet}
        onClick={handleSubmit}>
        <App.Text color="#09051D" size={15} weight={700}>
          { formOption.title } { form.amount } { current.symbol }
        </App.Text>
        { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
        {
          loading
            ? <App.Loader size={30} sx={{position: 'absolute'}} />
            : null
        }
      </App.Button>
    </App.Flex>
  )
})

export default TradeFormTaker
