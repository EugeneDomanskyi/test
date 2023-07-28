import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
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
  const { getNftBalanceUser } = useTrade()
  
  const orderBook = useSelector($exchange.get.orderBook)
  const currentCollection = useSelector(({$collection}) => $collection.current)
  const loadingCollectionData = useSelector(({$exchange}) => $exchange.loadingCollectionData)
  const blockchain = useSelector($app.get.blockchain)

  const [currentTab, setCurrentTab] = useState('buy')
  const [formType, setFormType] = useState('market')
  const [userBalances, setUserBalances] = useState({native: 0, token: 0})
  const [limitForm, setLimitForm] = useState({price: '0', amount: '1', total: '0'})

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

  useEffect(() => {
    const getBalances = async () => {
      if (currentCollection?.address && wallet) {
        const nftBalance = await getNftBalanceUser(currentCollection.address, wallet)
        const nativeBalance = await getBalance(blockchain.wrapped.contract)
        setUserBalances({native: nativeBalance, token: nftBalance})
      }
    }
    getBalances()
  }, [wallet, currentCollection?.address])

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
  }, [loadingCollectionData, currentCollection?.address])

  const setInitialPrice = price => {
    setLimitForm(state => ({
      ...state,
      price: price.toString(),
      total: (state.amount * price).toString()
    }))
  }

  const handleChangeTab = tab => {
    setCurrentTab(tab)
  }

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
                  userBalances={userBalances}
                  currentTab={currentTab}
                  currentOption={currentOption} />
              )
              case 'limit':
                return (
                  <TradeFormLimit
                    currentTab={currentTab}
                    currentOption={currentOption}
                    userBalances={userBalances}
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
