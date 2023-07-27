import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import $app from '@/store/app'
import $exchange from '@/store/exchange'
import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade'

import App from '@/components/App'
import Tabs from '@/components/Exchange/Tabs'
import TradeFormLimit from '@/components/Exchange/TradeForm/TradeFormLimit'
import TradeFormMarket from '@/components/Exchange/TradeForm/TradeFormMarket'

const TAB_OPTIONS = [
  {key: 'buy', title: 'BUY', color: 'rgb(13, 198, 109)'},
  {key: 'sell', title: 'SELL', color: 'rgb(206, 22, 93)'},
]

const TradeForm = forwardRef((_props, ref) => {
  const { wallet, getBalance } = useWalletConnect()
  const { getNftBalanceUser, getNftUser } = useTrade()
  
  const blockchain = useSelector($app.get.blockchain)
  const orderBook = useSelector($exchange.get.orderBook)
  const currentCollection = useSelector(({$collection}) => $collection.current)
  const loadingCollectionData = useSelector(({$exchange}) => $exchange.loadingCollectionData)

  const [userBalances, setUserBalances] = useState({native: 0, token: 0})
  const [form, setForm] = useState({price: '0', amount: '1', total: '0'})

  const [limitForm, setLimitForm] = useState({price: '0', amount: '1'})

  const [currentTab, setCurrentTab] = useState('buy')
  const [formType, setFormType] = useState('market')

  const priceSetted = useRef(false)

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      priceSetted.current = true
      handleChangeTab(data.side)
      // handleChangeForm('price')(data.price.toString())
      // handleChangeForm('amount')(data.amount.toString())
    }
  }))

  const currentOption = TAB_OPTIONS.find(opt => opt.key === currentTab)
  const [lowestBuy] = orderBook.buy
  const [lowestSell] = orderBook.sell

  // useEffect(() => {
  //   priceSetted.current = false
  // }, [currentCollection?.address])

  useEffect(() => {
    const getBalances = async () => {
      if (currentCollection?.address && wallet) {
        const nftBalance = await getNftBalanceUser(currentCollection.address, wallet)
        const nativeBalance = await getBalance()
        setUserBalances({
          native: nativeBalance,
          token: nftBalance,
        })
      }
    }
    getBalances()
  }, [blockchain, wallet, currentCollection?.address])

  useEffect(() => {
    if (priceSetted.current) {
      return
    }
    if (!loadingCollectionData && currentCollection?.address) {
      if (currentTab === 'buy') {
        setInitialPrice(lowestBuy?.price || currentCollection?.price)
      } else {
        setInitialPrice(lowestSell?.price || currentCollection?.price)
      }
    }
    // if (currentTab === 'buy' && lowestBuy) {
    //   setInitialPrice(lowestBuy.price)
    // } else if (!lowestBuy && currentCollection?.price) {
    //   setInitialPrice(currentCollection?.price)
    // }
    // if (currentTab === 'sell' && lowestSell) {
    //   setInitialPrice(lowestSell.price)
    // } else if (!lowestBuy && currentCollection?.price) {
    //   setInitialPrice(currentCollection?.price)
    // }
  }, [loadingCollectionData, currentCollection?.address])

  const setInitialPrice = price => {
    console.log('setInitialPrice', price)
    setLimitForm(state => ({...state, price: price.toString()}))
    // handleChangeForm('price')(price)
    // priceSetted.current = true
  }

  const handleChangeTab = tab => {
    setCurrentTab(tab)
  }

  // const handleChangeForm = field => value => {
  //   switch (field) {
  //     case 'price':
  //       setForm(state => ({
  //         ...state,
  //         price: value,
  //         total: (value*state.amount).toString(),
  //       }))
  //       return
  //     case 'amount':
  //       const regex = /^\d+[,]?\d{0,2}$/
  //       if (value && !regex.test(value)) {
  //         return 
  //       }
  //       setForm(state => ({
  //         ...state,
  //         amount: value,
  //         total: (value*state.price).toString(),
  //       }))
  //       return
  //     case 'total':
  //       setForm(state => {
  //         const amount = Math.floor(value/state.price)
  //         return {
  //           ...state,
  //           total: value,
  //           amount: amount,
  //         }
  //       })
  //       return
  //   }
  // }

  const handleChangeFormType = type => () => {
    setFormType(type)
  }

  return (
    <App.Flex className={styles.container} column>
      <Tabs
        options={TAB_OPTIONS}
        active={currentTab}
        onChange={handleChangeTab} />
      <App.Flex gap={16} sx={{padding: '24px 16px'}}>
        <App.Button className={cn(styles.formTypeButton, {[styles.active]: formType === 'market'})} onClick={handleChangeFormType('market')}>
          {
            formType === 'market'
              ? <App.Icon icon="check" />
              : null
          }
          <App.Text color={formType === 'market' ? '#fff' : '#5E5C6B'} weight={600} size={12}>Market Order</App.Text>
        </App.Button>
        <App.Button className={cn(styles.formTypeButton, {[styles.active]: formType === 'limit'})} onClick={handleChangeFormType('limit')}>
          {
            formType === 'limit'
              ? <App.Icon icon="check" />
              : null
          }
          <App.Text color={formType === 'limit' ? '#fff' : '#5E5C6B'} weight={600} size={12}>Limit Order</App.Text>
        </App.Button>
      </App.Flex>
      {
        (form => {
          switch (form) {
            case 'market':
              return (
                <TradeFormMarket
                  currentTab={currentTab} />
              )
              case 'limit':
                return (
                  <TradeFormLimit
                    currentTab={currentTab}
                    currentOption={currentOption}
                    initialForm={limitForm} />
                )
              default:
                return null
          }
        })(formType)
      }
    </App.Flex>
  )
})

const isEqual = () => {
  return true
}

export default memo(TradeForm, isEqual)
