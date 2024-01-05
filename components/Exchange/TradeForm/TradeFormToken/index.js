import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector } from 'react-redux'
import numeral from 'numeral'
import cn from 'classnames'

import $app from '@/store/app'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import Contracts from '@/libs/contracts.lib'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeForm/TradeInput'
import OrderConfirm from '@/components/Exchange/OrderConfirm'

import styles from './styles.module.scss'

const trimLeadingZerosBeforeDecimal = number => {
  return number.toString().replace(/^0+(?=\d+(\.\d*)?$)/, '').replace(/^\.(\d*)$/, '0.$1')
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
  const { wallet, changeNetwork } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)

  const [form, setForm] = useState({price: '', amount: '1', total: '0'})
  const [userBalances, setUserBalances] = useState({base: 0, quote: 0})
  const [wasUserBalance, setWasUserBalance] = useState(false)
  const [wasUserInput, setWasUserInput] = useState(false)
  const [isErrorBalance, setIsErrorBalance] = useState(false)
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState(false)

  const isWrongPrice = checkPrice(form.price, currentTab, current.price)
  const isDisabled = !(form.amount*1) || !(form.price*1) || !(form.total*1)

  const loadingRef = useRef(false)
  const unsubscribeRef = useRef()

  const contracts = new Contracts()

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      if (data.hasOwnProperty('price')) {
        handleChangeForm('price')(data.price.toString())
      } else {
        handleSetPrice(false, data?.side)
      }

      if (data.hasOwnProperty('amount')) {
        handleChangeForm('amount')(data.amount.toString())
      }
    }
  }))

  useEffect(() => {
    setWasUserBalance(false)
    setWasUserInput(false)
    setIsErrorBalance(false)

    handleSetPrice(false)
  }, [current?.id])

  useEffect(() => {
    if (prevProps?.side) {
      handleChangeForm('price')(prevProps.price)
      handleChangeForm('amount')(prevProps.makerAmountFormatted)
    } else {
      handleSetPrice(false)
    }
  }, [prevProps])

  useEffect(() => {
    if (wasUserBalance) {
      setIsErrorBalance(currentTab == 'buy' && (form.total * 1 > userBalances.quote * 1) || currentTab == 'sell' && (form.amount * 1 > userBalances.base * 1))
    }
  }, [form.total, form.amount, currentTab, wasUserBalance])

  useEffect(() => {
    if (wallet && current?.address) {
      (async () => {
        unsubscribeRef.current = await contracts.watchBalance(wallet, [current?.address, current?.quote], (result) => {
          const balances = Object.entries(result).reduce((acc, [address, balance]) => ({
            ...acc,
            [address === current?.quote ? 'quote' : 'base']: balance,
          }), {quote: 0, base: 0})

          setUserBalances(balances)
          setWasUserBalance(true)
        })
      })()
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [wallet, current?.address])

  const handleSetPrice = (inputByUser = true, tab = currentTab) => {
    handleChangeForm('price', inputByUser)(current?.trade?.[tab] || current.price || 0)
  }

  const handleChangePrice = (type) => () => {
    const step = 0.1
    const newPrice = type == 'plus' ? (form.price * 1 + step) : (form.price * 1 - step)
    handleChangeForm('price', true)(newPrice)
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
        setForm(state => ({
          ...state,
          price: value,
          total: numeral(value*state.amount).format('0.0[0000]'),
        }))
        return
      case 'amount':
        setForm(state => {
          return {
            ...state,
            amount: value,
            total: numeral(value*state.price).format('0.0[0000]'),
          }
        })
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

    if (isErrorBalance) {
      setWasUserInput(true)
      return
    }
    
    loadingRef.current = true

    const props = {
      side: currentTab,
      blockchain: blockchain,
      current: current,
      price: form.price,
      amount: form.amount,
      total: numeral(form.amount * form.price).format('0.0[0000]'),
    }

    if (version == 'mobile') {
      if (onSubmit) {
        onSubmit(props)
      }
    } else {
      setIsOrderConfirmOpen(true)
    }

    trackEvent('Create Order Click', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Side': currentTab.toUpperCase(),
      'Quantity': form.amount,
      'Price': form.price,
      'Total': numeral(form.amount*form.price).format('0.0[0000]'),
      'Network': blockchain.code.toUpperCase(),
    })
  }

  const handleTotalBlur = () => {
    handleChangeForm('price')(form.total / form.amount)
    trackEvent('Add Total', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Price': form.price,
      'Network': blockchain.code.toUpperCase(),
    })
  }

  const handleBlurPrice = () => {
    trackEvent('Add Price', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Price': form.price,
      'Network': blockchain.code.toUpperCase(),
    })
  }

  const handleBlurAmount = () => {
    trackEvent('Add Quantity', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Price': form.price,
      'Network': blockchain.code.toUpperCase(),
    })
  }

  const handleClickMultipler = (percentage) => () => {
    if (currentTab === 'buy') {
      handleChangeForm('total', true)(userBalances.quote * percentage)
    } else {
      handleChangeForm('amount', true)(userBalances.base * percentage)
    }
  }

  const handleOrderConfirmClose = () => {
    setIsOrderConfirmOpen(false)
  }

  const renderBalance = () => {
    return (
      <App.Flex className={cn(styles.balance, {[styles.error]: isErrorBalance && wasUserInput})}>
        <App.Flex flex={1} align="center" gap={4}>
          <App.Icon icon="wallet" width={10} height={10} color={isErrorBalance && wasUserInput ? '#FF1D61' : '#B9B8C5'} />
          <App.Text size={10} color={isErrorBalance && wasUserInput ? '#FF1D61' : '#B9B8C5'} height={1}>
            {currentTab === 'buy' ? `${userBalances.quote} USDT` : `${userBalances.base} ${current.symbol}`}
          </App.Text>
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
                currency={'USDT'}
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
              currency={'USDT'}
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
          total={numeral(form.amount * form.price).format('0.0[0000]')}
          onClose={handleOrderConfirmClose}
        />
      </App.Dialog>
    </>
  )
})

export default TradeFormToken
