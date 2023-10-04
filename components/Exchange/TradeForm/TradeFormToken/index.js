import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'

import $app from '@/store/app'
import $modal from '@/store/modal'
import $orders from '@/store/orders'
import useWalletConnect from '@/myhooks/wallet-connect'
import useInterval from '@/myhooks/useInterval'
import { trackEvent } from '@/libs/analytics.lib'
import { INCH_TOKENS } from '@/config'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'
import numeral from 'numeral'

const trimLeadingZerosBeforeDecimal = number => {
  return number.toString().replace(/^0+(?=\d+(\.\d*)?$)/, '')
}

const TradeFormToken = forwardRef(({current, currentTab, formOption}, ref) => {
  const dispatch = useDispatch()
  const { wallet, changeNetwork, getBalance } = useWalletConnect()
  
  const blockchain = useSelector($app.get.blockchainByCode(current?.blockchain))
  const orderBook = useSelector($orders.get.orderBook('tokens'))
  const orderBookId = useSelector(({$orders}) => $orders.orderBookId)

  const [form, setForm] = useState({price: '', amount: '1', total: '0'})
  const [userBalances, setUserBalances] = useState({token: 0, usdt: 0})

  const isDisabled = !(form.amount*1) || !(form.price*1) || !(form.total*1)

  const loadingRef = useRef(false)

  useEffect(() => {
    handleSetPrice()
  }, [orderBookId])

  const fetchBalance = async () => {
    const [tokenBalance, usdtBalance] = await Promise.all([
      getBalance(current.address),
      getBalance(blockchain.usdtContract)
    ])
    setUserBalances({usdt: usdtBalance, token: tokenBalance})
  }

  const handleSetPrice = () => {
    switch (currentTab) {
      case 'buy':
        const [cheapestOrder] = orderBook.sell
        if (cheapestOrder && cheapestOrder.priceFormatted) {
          handleChangeForm('price')(cheapestOrder.priceFormatted.toString())
          handleChangeForm('amount')(cheapestOrder.quantity.toString())
        } else if (current.price) {
          handleChangeForm('price')(current.price)
        } else {
          handleChangeForm('price')('')
        }
        break
      case 'sell':
        const [expensiveOrder] = orderBook.buy
        if (expensiveOrder && expensiveOrder.priceFormatted) {
          handleChangeForm('price')(expensiveOrder.priceFormatted.toString())
          handleChangeForm('amount')(expensiveOrder.quantity.toString())
        } else if (current.price) {
          handleChangeForm('price')(current.price)
        } else {
          handleChangeForm('price')('')
        }
        break
    }
  }

  const handleChangeForm = field => value => {
    value = trimLeadingZerosBeforeDecimal(value)
    const decimalRegExp = /^(?=.*\d)\d*(?:\.\d*)?$/
    if (!decimalRegExp.test(value) && value) {
      return
    }
    value = value.indexOf('.')+1 ? value.substring(0, value.indexOf('.') + 6) : value
    switch (field) {
      case 'price':
        setForm(state => ({
          ...state,
          price: value,
          total: numeral(value*state.amount).format('0.0[0000]'),
        }))
        return
      case 'amount':
        setForm(state => ({
          ...state,
          amount: value,
          total: numeral(value*state.price).format('0.0[0000]'),
        }))
        return
      case 'total':
        setForm(state => {
          const amount = Math.floor(value/state.price)
          return {
            ...state,
            total: value,
            amount: isNaN(amount) || !isFinite(amount) ? state.amount : amount,
          }
        })
        return
    }
  }

  const handleSubmit = async () => {
    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }
    
    loadingRef.current = true

    const usdtAsset = INCH_TOKENS[blockchain.usdtContract.toLowerCase()]
    const usdtFormatted = {
      ...usdtAsset,
      image: usdtAsset.logoURI,
    }
    dispatch($modal.set.show({
      show: true,
      modal: 'Exchange/OrderProceed',
      props: {
        side: currentTab,
        blockchain: blockchain,
        makerAsset: currentTab === 'buy' ? current : usdtFormatted,
        takerAsset: currentTab === 'buy' ? usdtFormatted : current,
        makerAmountFormatted: form.amount,
        takerAmountFormatted: numeral(form.amount*form.price).format('0.0[0000]'),
        price: form.price,
      }
    }))
  }

  const handleTotalBlur = () => {
    handleChangeForm('price')(form.total/form.amount)
    trackEvent('Add Total', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Total': form.total,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
      'Network': blockchain.name,
    })
  }

  const handleBlurPrice = () => {
    trackEvent('Add Price', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Price': form.price,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
      'Network': blockchain.name,
    })
  }

  const handleBlurAmount = () => {
    trackEvent('Add Amount', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Amount': form.amount,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
      'Network': blockchain.name,
    })
  }

  const handleClickMultipler = (percentage) => () => {
    if (currentTab === 'buy') {
      handleChangeForm('total')(userBalances.usdt * percentage)
    } else {
      handleChangeForm('amount')(userBalances.token * percentage)
    }
  }

  const renderBalance = () => {
    return (
      <App.Flex className={styles.balance}>
        <App.Flex flex={1} align="center" gap={4}>
          <App.Icon icon="wallet" />
          <App.Text size={10} color="rgba(255,255,255,0.6)">
            {
              currentTab === 'buy'
                ? `${userBalances.usdt} USDT`
                : `${userBalances.token} ${current.symbol}`
            }
          </App.Text>
        </App.Flex>
        <App.Flex className={styles.multipler} align="center" gap={8}>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.25)}>25%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.5)}>50%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.75)}>75%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(1)}>100%</App.Text>
        </App.Flex>
      </App.Flex>
    )
  }

  useInterval(fetchBalance, (wallet && blockchain && current?.address) ? 2000 : null)

  return (
    <App.Flex column className={styles.form}>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="AT PRICE"
          currency={'USDT'}
          value={form.price}
          onBlur={handleBlurPrice}
          onChange={handleChangeForm('price')} />
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="AMOUNT"
          value={form.amount}
          currency={current.symbol}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('amount')} />
        {
          currentTab === 'sell'
            ? renderBalance()
            : null
        }
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="TOTAL"
          currency={'USDT'}
          value={form.total}
          onBlur={handleTotalBlur}
          onChange={handleChangeForm('total')} />
          {
            currentTab === 'buy'
              ? renderBalance()
              : null
          }
      </App.Flex>
      <App.Button
        sx={{backgroundColor: formOption.color, opacity: isDisabled ? 0.5 : 1,}}
        className={styles.button}
        disabled={isDisabled}
        onClick={handleSubmit}>
        <App.Text color="#09051D" size={15} weight={700}>
          { formOption.title } {`${form.amount || 0}` } { current.symbol }
        </App.Text>
        { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
      </App.Button>
    </App.Flex>
  )
})

export default TradeFormToken
