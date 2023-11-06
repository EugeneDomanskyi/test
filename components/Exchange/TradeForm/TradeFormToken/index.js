import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

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

const getDecimalsCount = string => {
  const [_, decimals] = string.toString().split('.')
  return decimals ? decimals.length : 0
}

const MAX_DECIMALS = 5

const TradeFormToken = forwardRef(({current, currentTab, version, formOption, prevProps, onSubmit}, ref) => {
  const dispatch = useDispatch()
  const { wallet, changeNetwork, getBalance } = useWalletConnect()
  
  const blockchain = useSelector($app.get.blockchain)
  const orderBook = useSelector($orders.get.orderBook('tokens'))
  const orderBookId = useSelector(({$orders}) => $orders.orderBookId)

  const [form, setForm] = useState({price: '', amount: '1', total: '0'})
  const [userBalances, setUserBalances] = useState({token: 0, usdt: 0})
  const [wasUserBalance, setWasUserBalance] = useState(false)
  const [wasUserInput, setWasUserInput] = useState(false)
  const [isErrorBalance, setIsErrorBalance] = useState(false)

  const isWrongPrice = checkPrice(form.price, currentTab, current.price)
  const isDisabled = !(form.amount*1) || !(form.price*1) || !(form.total*1)

  const loadingRef = useRef(false)

  const countOfDecimals = {
    price: getDecimalsCount(form.price),
    amount: getDecimalsCount(form.amount),
  }

  // console.log(countOfDecimals)

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      handleChangeForm('price')(data.price.toString())
      // handleChangeForm('amount')(data.amount.toString())
    }
  }))

  useEffect(() => {
    setWasUserBalance(false)
    setWasUserInput(false)
    setIsErrorBalance(false)
  }, [current])

  useEffect(() => {
    if (prevProps?.side) {
      handleChangeForm('price')(prevProps.price)
      handleChangeForm('amount')(prevProps.makerAmountFormatted)
    } else {
      handleSetPrice(false)
    }
  }, [orderBookId, prevProps])

  useEffect(() => {
    if (wasUserBalance) {
      setIsErrorBalance(currentTab == 'buy' && (form.total * 1 > userBalances.usdt * 1) || currentTab == 'sell' && (form.amount * 1 > userBalances.token * 1))
    }
  }, [form.total, form.amount, currentTab, wasUserBalance])

  const fetchBalance = async () => {
    const [tokenBalance, usdtBalance] = await Promise.all([
      getBalance(current.address),
      getBalance(blockchain.usdtContract)
    ])
    setUserBalances({usdt: usdtBalance, token: tokenBalance})
    setWasUserBalance(true)
  }

  const handleSetPrice = (inputByUser = true) => {
    switch (currentTab) {
      case 'buy':
        const [cheapestOrder] = orderBook.sell
        if (cheapestOrder && cheapestOrder.priceFormatted) {
          handleChangeForm('price', inputByUser)(cheapestOrder.priceFormatted.toString())
        } else if (current.price) {
          handleChangeForm('price', inputByUser)(current.price)
        } else {
          handleChangeForm('price', inputByUser)('')
        }
        break
      case 'sell':
        const [expensiveOrder] = orderBook.buy
        if (expensiveOrder && expensiveOrder.priceFormatted) {
          handleChangeForm('price', inputByUser)(expensiveOrder.priceFormatted.toString())
        } else if (current.price) {
          handleChangeForm('price', inputByUser)(current.price)
        } else {
          handleChangeForm('price', inputByUser)('')
        }
        break
    }
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
        value = value.indexOf('.')+1 ? value.substring(0, value.indexOf('.') + (MAX_DECIMALS + 1 - countOfDecimals.amount)) : value
        setForm(state => ({
          ...state,
          price: value,
          total: numeral(value*state.amount).format('0.0[0000]'),
        }))
        return
      case 'amount':
        value = value.indexOf('.')+1 ? value.substring(0, value.indexOf('.') + (MAX_DECIMALS + 1 - countOfDecimals.price)) : value
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
          value = value.indexOf('.')+1 ? value.substring(0, value.indexOf('.') + (MAX_DECIMALS + 1)) : value
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

    const usdtAsset = INCH_TOKENS[blockchain.usdtContract.toLowerCase()]
    const usdtFormatted = {
      ...usdtAsset,
      image: usdtAsset.logoURI,
    }

    const props = {
      side: currentTab,
      blockchain: blockchain,
      makerAsset: currentTab === 'buy' ? current : usdtFormatted,
      takerAsset: currentTab === 'buy' ? usdtFormatted : current,
      makerAmountFormatted: form.amount,
      takerAmountFormatted: numeral(form.amount*form.price).format('0.0[0000]'),
      price: form.price,
    }

    if (version == 'mobile') {
      if (onSubmit) {
        onSubmit(props)
      }
    } else {
      dispatch($modal.set.show({
        show: true,
        modal: 'Exchange/OrderProceed',
        props,
      }))
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
    handleChangeForm('price')(form.total/form.amount)
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
      handleChangeForm('total', true)(userBalances.usdt * percentage)
    } else {
      handleChangeForm('amount', true)(userBalances.token * percentage)
    }
  }

  const renderBalance = () => {
    return (
      <App.Flex className={cn(styles.balance, {[styles.error]: isErrorBalance && wasUserInput})}>
        <App.Flex flex={1} align="center" gap={4}>
          <App.Icon icon="wallet" width={14} height={14} color={isErrorBalance && wasUserInput ? '#FF1D61' : '#B9B8C5'} />
          <App.Text size={12} weight={600}  color={isErrorBalance && wasUserInput ? '#FF1D61' : '#B9B8C5'}>
            {
              currentTab === 'buy'
                ? `${userBalances.usdt} USDT`
                : `${userBalances.token} ${current.symbol}`
            }
          </App.Text>
        </App.Flex>
        <App.Flex className={styles.multipler} align="center" gap={8}>
          <App.Text color="#B9B8C5" size={12} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.25)}>25%</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.5)}>50%</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.75)}>75%</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(1)}>100%</App.Text>
        </App.Flex>
      </App.Flex>
    )
  }

  useInterval(fetchBalance, (wallet && blockchain && current?.address) ? 2000 : null)

  return (
    <App.Flex column className={cn(styles.form, {[styles[version]]: version})}>
        <App.Flex justify="flex-end" align="center" sx={{marginBottom: 16}}>
          <App.Tooltip placement="bottom-end" text={<App.Text size={12} color="#B9B8C5">Take control of your trades. Set your own price for buying or selling assets with this versatile trading tool.</App.Text>}>
            <App.Flex row align="center" sx={{ cursor: 'pointer' }}>
              <App.Text color="rgba(255,255,255,0.6)" size={10} weight={600} italic sx={{marginRight: 8}}>Limit Order</App.Text>
              <App.Icon icon="info" width={12} height={12} />
            </App.Flex>
          </App.Tooltip>
        </App.Flex>

      <App.Flex column sx={{marginBottom: 10}}>
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
              <App.Text size={12} weight={600} color={currentTab === 'buy' ? '#53F19C' : '#FF1D61'}>
                { currentTab === 'buy' ? 'LOWEST PRICE' : 'HIGHEST PRICE' }
              </App.Text>
            </App.Flex>
          )}
        </App.Flex>
        {
          isWrongPrice
            ? <App.Text color="#FFD600" size={10} weight={500}>
                {currentTab === 'buy' ? 'Price deviation is more than 10% above the last trade price.' : 'The price deviation is less than the last traded price.'}
              </App.Text>
            :  <App.Text color="#FFD600" size={10} weight={500}>&nbsp;</App.Text>
        }
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="AMOUNT"
          value={form.amount}
          version={version}
          currency={current.symbol}
          error={currentTab == 'sell' && isErrorBalance && wasUserInput}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('amount', true)}
        />
        {
          currentTab === 'sell'
            ? renderBalance()
            : null
        }

        {currentTab == 'sell' && isErrorBalance && wasUserInput ? (
          <App.Flex sx={{ paddingTop: 8 }}>
            <App.Text size={12} weight={600}  color="#FF1D61">Insufficient funds in your wallet to make this purchase</App.Text>
          </App.Flex>
        ): null}
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="TOTAL"
          currency={'USDT'}
          value={form.total}
          version={version}
          error={currentTab == 'buy' && isErrorBalance && wasUserInput}
          onBlur={handleTotalBlur}
          onChange={handleChangeForm('total', true)}
        />
          {
            currentTab === 'buy'
              ? renderBalance()
              : null
          }

        {currentTab == 'buy' && isErrorBalance && wasUserInput ? (
          <App.Flex sx={{ paddingTop: 8 }}>
            <App.Text size={12} weight={600}  color="#FF1D61">Insufficient funds in your wallet to make this purchase</App.Text>
          </App.Flex>
        ): null}
      </App.Flex>
      {version == 'mobile' ? (
        <App.Button xl fullWidth variant={currentTab == 'buy' ? 'success' : 'danger'} disabled={isDisabled || (isErrorBalance && wasUserInput)} onClick={handleSubmit}>
          {formOption.title}
        </App.Button>
      ) : (
        <App.Button
          sx={{backgroundColor: formOption.color, opacity: (isDisabled || (isErrorBalance && wasUserInput)) ? 0.5 : 1,}}
          className={styles.button}
          disabled={isDisabled || (isErrorBalance && wasUserInput)}
          onClick={handleSubmit}
        >
          <App.Text color="#09051D" size={15} weight={700}>
            { formOption.title } {`${form.amount || 0}` } { current.symbol }
          </App.Text>
          { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
        </App.Button>
      )}
    </App.Flex>
  )
})

export default TradeFormToken
