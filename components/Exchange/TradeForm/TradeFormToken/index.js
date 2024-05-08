import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formatUnits } from 'viem'
import Decimal from 'decimal.js'
import cn from 'classnames'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $alert from '@/store/alert'

import WagmiHelper from '@/libs/WagmiHelper'
import Amplitude from '@/libs/amplitude.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeForm/TradeInput'
import OrderConfirm from '@/components/Exchange/OrderConfirm'

import styles from './styles.module.scss'

const trimLeadingZerosBeforeDecimal = number => {
  return number ? number.toString().replace(/^0+(?=\d+(\.\d*)?$)/, '').replace(/^\.(\d*)$/, '0.$1') : 0
}

const checkPrice = (price, tab, marketPrice) => {
  if (!Boolean(price*1)) {
    return false
  }
  switch (tab) {
    case 'buy':
      return marketPrice && price*1 > marketPrice*1.1
    case 'sell':
      return marketPrice && price*1 < marketPrice/1.1
    default:
      return false
  }
}

const TradeFormToken = forwardRef(({current, currentTab, version, prevProps, onSubmit}, ref) => {
  const { wallet, connect } = useWagmiHelper()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const orderBook = useSelector($orders.get.orderbook)
  const portfolio = useSelector(({ $portfolio }) => $portfolio.list)
  const isApp = useSelector(({ $app }) => $app.isApp)

  const [form, setForm] = useState({price: '0', amount: '1', total: '0'})
  const [userBalances, setUserBalances] = useState({base: 0, quote: 0})
  const [wasUserInput, setWasUserInput] = useState(false)
  const [isErrorBalance, setIsErrorBalance] = useState(false)
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false)

  const isWrongPrice = checkPrice(form.price, currentTab, current.price)
  const isDisabled = !(form.amount*1) || !(form.price*1) || !(form.total*1)

  const loadingRef = useRef(false)

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      if (data.hasOwnProperty('price')) {
        handleChangeForm('price')(data.price.toString())
      } else {
        if (!wasUserInput) {
          handleSetPrice(false, data?.side)
        }
      }

      if (data.hasOwnProperty('amount')) {
        handleChangeForm('amount')(data.amount.toString())
      }
    }
  }))

  useEffect(() => {
    setWasUserInput(false)
    setIsErrorBalance(false)

    handleSetPrice(false)
  }, [current?.id])

  useEffect(() => {
    if (!wasUserInput) {
      handleSetPrice(false)
    }
  }, [orderBook])

  useEffect(() => {
    if (prevProps?.side) {
      handleChangeForm('price')(prevProps.price)
      handleChangeForm('amount')(prevProps.amount)
    } else {
      handleSetPrice(false)
    }
  }, [prevProps])

  useEffect(() => {
    setIsErrorBalance(currentTab == 'buy' && (form.total * 1 > userBalances.quote * 1) || currentTab == 'sell' && (form.amount * 1 > userBalances.base * 1))
  }, [form.total, form.amount, currentTab, userBalances])

  useEffect(() => {
    if (!wallet) {
      setUserBalances({base: 0, quote: 0})
    } else {
      setUserBalances({
        base: portfolio.find(item => item.address == current.address)?.available ?? 0,
        quote: portfolio.find(item => item.address == current.quote)?.available ?? 0,
      })
    }
  }, [wallet, portfolio, current])

  const handleSetPrice = (inputByUser = true, tab = currentTab) => {
    const invertedtab = tab == 'buy' ? 'sell' : 'buy'
    const price = orderBook[invertedtab].length ? orderBook[invertedtab][0].priceFormatted : current.price
    handleChangeForm('price', inputByUser)(price)
  }

  const handleChangePrice = (type) => () => {
    const step = 0.1
    const newPrice = type == 'plus' ? (form.price * 1 + step) : (form.price * 1 - step)
    handleChangeForm('price', true)(new Decimal(newPrice).toDecimalPlaces(current.quoteDecimals).toFixed())
  }

  const handleChangeForm = (field, inputByUser = false) => value => {
    if (inputByUser) {
      setWasUserInput(true)
    }

    value = trimLeadingZerosBeforeDecimal(value)
    const decimalRegExp = /^(?=.*\d)\d*(?:\.\d*)?$/
    if (!decimalRegExp.test(value) && value) {
      return
    }
    switch (field) {
      case 'price':
        setForm(state => {
          return {
            ...state,
            price: value,
            total: new Decimal(value * state.amount).toDecimalPlaces(current.quoteDecimals).toFixed(),
          }
        })
        return
      case 'amount':
        setForm(state => {
          return {
            ...state,
            amount: value,
            total: new Decimal(value * state.price).toDecimalPlaces(current.quoteDecimals).toFixed(),
          }
        })
        return
      case 'total':
        setForm(state => {
          const amount = new Decimal(value / state.price).toDecimalPlaces(current.decimals).toFixed()
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
    const wallet = await connect()
    if (!wallet) {
      return
    }

    const network = await WagmiHelper.changeChain(blockchain.code)
    if (!network) {
      return
    }

    if (isErrorBalance) {
      setWasUserInput(true)
      return
    }

    if (blockchain?.info?.min_order_value) {
      const minTotal = formatUnits(blockchain.info.min_order_value, current.quoteDecimals)
      if (minTotal * 1 > form.total * 1) {
        dispatch($alert.set.error({
          title: 'Order Error',
          text: `The minimum order value is ${minTotal} ${current.quoteSymbol}.`,
        }))
        return
      }
    }
    
    loadingRef.current = true

    Amplitude.event('Create Order Click', {
      'Base Currency': current.symbol,
      'Quote Currency': current.quoteSymbol,
      'Side': currentTab.toUpperCase(),
      'Price': form.price,
      'Quantity': form.amount,
      'Total': form.total,
      'Source': isApp ? 'App' : 'Web',
      'Chain ID': blockchain?.id,
      'Market ID': current?.address,
    })

    const props = {
      side: currentTab,
      blockchain: blockchain,
      current: current,
      price: form.price,
      amount: form.amount,
      total: form.total,
    }

    if (version == 'mobile') {
      if (onSubmit) {
        onSubmit(props)
      }
    } else {
      setIsOrderConfirmOpen(true)
    }
  }

  const handleTotalBlur = () => {
    handleChangeForm('price', true)(new Decimal(form.total / form.amount).toFixed())
    Amplitude.event('Add Total', {
      'Base Currency': current.symbol,
      'Quote Currency': current.quoteSymbol,
      'Total': form.total,
      'Source': isApp ? 'App' : 'Web',
      'Chain ID': blockchain?.id,
      'Market ID': current?.address,
    })
  }

  const handleBlurPrice = () => {
    Amplitude.event('Add Price', {
      'Base Currency': current.symbol,
      'Quote Currency': current.quoteSymbol,
      'Price': form.price,
      'Source': isApp ? 'App' : 'Web',
      'Chain ID': blockchain?.id,
      'Market ID': current?.address,
    })
  }

  const handleBlurAmount = () => {
    Amplitude.event('Add Quantity', {
      'Base Currency': current.symbol,
      'Quote Currency': current.quoteSymbol,
      'Quantity': form.amount,
      'Source': isApp ? 'App' : 'Web',
      'Chain ID': blockchain?.id,
      'Market ID': current?.address,
    })
  }

  const handleClickMultipler = (percentage) => () => {
    if (currentTab === 'buy') {
      const number = new Decimal(userBalances.quote * percentage)
      handleChangeForm('total', true)(number.toFixed())
    } else {
      const number = new Decimal(userBalances.base * percentage)
      handleChangeForm('amount', true)(number.toFixed())
    }
  }

  const handleOrderConfirmClose = () => {
    setIsOrderConfirmOpen(false)
  }

  const renderBalance = () => {
    return (
      <App.Flex className={cn(styles.balance, {[styles.error]: isErrorBalance && wasUserInput})}>
        <App.Flex column flex={1} gap={4}>
          <App.Flex row align="center" gap={4}>
            <App.Icon icon="wallet" width={10} height={10} color={isErrorBalance && wasUserInput ? '#FF1D61' : '#B9B8C5'} />
            <App.Text size={10} color={isErrorBalance && wasUserInput ? '#FF1D61' : '#B9B8C5'} height={1}>
              {currentTab === 'buy' ? `${userBalances.quote} ${current.quoteSymbol}` : `${userBalances.base} ${current.symbol}`}
            </App.Text>
          </App.Flex>

          <App.Flex sx={{ paddingLeft: 14 }}>
            <App.Text size={10} color="#b9b8c5">Fee: {blockchain?.info?.fee ?? 0}%</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.multipler} align="center" gap={8}>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} height={1} onClick={handleClickMultipler(0.25)}>25%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} height={1} onClick={handleClickMultipler(0.5)}>50%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} height={1} onClick={handleClickMultipler(0.75)}>75%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} height={1} onClick={handleClickMultipler(1)}>100%</App.Text>
        </App.Flex>
      </App.Flex>
    )
  }

  return (
    <>
      <App.Flex column gap={16} className={cn(styles.form, {[styles[version]]: version})}>
        <App.Flex justify="flex-end" align="center">
          <App.Tooltip placement="bottom-end" text={<App.Text size={12} color="#B9B8C5">Take control of your trades. Set your own price for buying or selling assets with this versatile trading tool.</App.Text>}>
            <App.Flex row align="center" sx={{ cursor: 'pointer' }}>
              <App.Text color="rgba(255,255,255,0.6)" size={12} weight={600} italic sx={{marginRight: 8}}>Limit Order</App.Text>
              <App.Icon icon="info" width={12} height={12} />
            </App.Flex>
          </App.Tooltip>
        </App.Flex>

        <App.Flex column gap={5}>
          <App.Flex column>
            <App.Flex justify="center" flex={1} column sx={{position: 'relative'}}>
              <TradeInput
                label="AT PRICE"
                currency={current.quoteSymbol}
                value={form.price}
                version={version}
                warning={isWrongPrice}
                onBlur={handleBlurPrice}
                onChange={handleChangeForm('price', true)}
              />
              
              {version == 'mobile' ? (
                <App.Flex row gap={8} className={styles.priceSetter}>
                  <App.Flex row center onClick={handleSetPrice}>
                    <App.Text size={12} weight={600} color={currentTab === 'buy' ? '#53F19C' : '#FF1D61'}>
                      { currentTab === 'buy' ? 'MIN' : 'MAX' }
                    </App.Text>
                  </App.Flex>

                  <App.Flex row center className={styles.buttonInput} onClick={handleChangePrice('plus')}>
                    <App.Icon icon="plus" />
                  </App.Flex>

                  <App.Flex row center className={styles.buttonInput} onClick={handleChangePrice('minus')}>
                    <App.Icon icon="minus" />
                  </App.Flex>
                </App.Flex>
              ) : (
                <App.Flex className={styles.priceSetter} onClick={handleSetPrice}>
                  <App.Text size={10} weight={600} color={currentTab === 'buy' ? '#53F19C' : '#FF1D61'} height={1}>
                    { currentTab === 'buy' ? 'LOWEST PRICE' : 'HIGHEST PRICE' }
                  </App.Text>
                </App.Flex>
              )}
            </App.Flex>

            <App.Flex sx={{ paddingTop: 4 }}>
              {isWrongPrice ? (
                <App.Text color="#FFD600" size={10} height={1}>
                  {currentTab === 'buy' ? 'Price deviation is more than 10% above the last trade price.' : 'The price deviation is less than the last traded price.'}
                </App.Text>
              ) : (
                <App.Text color="#FFD600" size={10} height={1}>&nbsp;</App.Text>
              )}
            </App.Flex>
          </App.Flex>

          <App.Flex column>
            <TradeInput
              label="AMOUNT"
              value={form.amount}
              version={version}
              currency={current.symbol}
              error={currentTab == 'sell' && isErrorBalance && wasUserInput}
              onBlur={handleBlurAmount}
              onChange={handleChangeForm('amount', true)}
            />

            {currentTab === 'sell' ? renderBalance(): null}

            <App.Flex sx={{ paddingTop: 4 }}>
              {currentTab == 'sell' && isErrorBalance && wasUserInput ? (
                <App.Text size={10} weight={600} color="#FF1D61" height={1}>Insufficient funds in your wallet to make this purchase</App.Text>
              ): (
                <App.Text color="#FFD600" size={10} height={1}>&nbsp;</App.Text>
              )}
            </App.Flex>
          </App.Flex>

          <App.Flex column>
            <TradeInput
              label="TOTAL"
              currency={current.quoteSymbol}
              value={form.total}
              version={version}
              error={currentTab == 'buy' && isErrorBalance && wasUserInput}
              onBlur={handleTotalBlur}
              onChange={handleChangeForm('total', true)}
            />

            {currentTab === 'buy' ? renderBalance() : null}

            <App.Flex sx={{ paddingTop: 4 }}>
              {currentTab == 'buy' && isErrorBalance && wasUserInput ? (
                <App.Text size={10} weight={600} color="#FF1D61" height={1}>Insufficient funds in your wallet to make this purchase</App.Text>
              ): (
                <App.Text color="#FFD600" size={10} height={1}>&nbsp;</App.Text>
              )}
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Button xl fullWidth variant={currentTab == 'buy' ? 'success' : 'danger'} disabled={isDisabled || (isErrorBalance && wasUserInput)} onClick={handleSubmit}>
          {currentTab.toUpperCase()}
        </App.Button>
      </App.Flex>

      <App.Dialog
        title={`${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} ${current?.symbol} with ${current?.quoteSymbol}`}
        width={420}
        open={isOrderConfirmOpen}
        onClose={handleOrderConfirmClose}
      >
        <OrderConfirm
          side={currentTab}
          blockchain={blockchain}
          current={current}
          price={form.price}
          amount={form.amount}
          total={form.total}
          onClose={handleOrderConfirmClose}
        />
      </App.Dialog>
    </>
  )
})

export default TradeFormToken
