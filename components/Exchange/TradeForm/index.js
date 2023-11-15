import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import Tabs from '@/components/Exchange/Tabs'
import TradeFormLimit from '@/components/Exchange/TradeForm/TradeFormLimit'
import TradeFormMarket from '@/components/Exchange/TradeForm/TradeFormMarket'
// import TradeFormTaker from '@/components/Exchange/TradeForm/TradeFormTaker'
// import TradeFormPlace from '@/components/Exchange/TradeForm/TradeFormPlace'
import TradeFormToken from '@/components/Exchange/TradeForm/TradeFormToken'

const TAB_OPTIONS = [
  { key: 'buy', title: 'BUY', color: 'rgb(13, 198, 109)' },
  { key: 'sell', title: 'SELL', color: 'rgb(206, 22, 93)' },
]

const TradeForm = forwardRef(({ current, type, version, fullWidth = null, onSubmit, prevProps }, ref) => {
  const { wallet, getBalance, changeNetwork } = useWalletConnect()
  const { getNftBalanceUser } = useTrade()

  const orderBook = useSelector($exchange.get.orderBook)
  const loading = useSelector(({ $exchange }) => $exchange.loadingCollectionData)
  const blockchain = useSelector($app.get.blockchainByCode(current?.blockchain))

  const [currentTab, setCurrentTab] = useState('buy')
  const [formType, setFormType] = useState('market')
  const [userBalances, setUserBalances] = useState({ native: 0, wrapped: 0, token: 0, usdt: 0 })
  const [limitForm, setLimitForm] = useState({ price: '0', amount: '1', total: '0' })
  const [marketForm, setMarketForm] = useState({ amount: '1' })

  const tokenFormRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      handleChangeTab(data.side)
      // setFormType(data.formType)
      setMarketForm({ amount: data.amount.toString() })
      if (tokenFormRef.current) {
        tokenFormRef.current.setForm({ amount: data.amount, price: data.price })
      }
    },

    setSide: (side) => {
      handleChangeTab(side)
    }
  }))

  const currentOption = TAB_OPTIONS.find(opt => opt.key === currentTab)
  const [lowestBuy] = orderBook.buy
  const [lowestSell] = orderBook.sell

  useEffect(() => {
    const getUserBalances = async () => {
      if (current?.address && wallet) {
        // await changeNetwork(current.blockchain)
        switch (type) {
          case 'nfts':
            getNftBalanceUser(current.address, wallet).then(res => {
              setUserBalances(state => ({ ...state, token: res }))
            })
            getBalance().then(res => {
              setUserBalances(state => ({ ...state, native: res }))
            })
            getBalance(blockchain.wrapped.contract).then(res => {
              setUserBalances(state => ({ ...state, wrapped: res }))
            })
            break
          // case 'tokens':
          //   getBalance(current.address).then(res => {
          //     setUserBalances(state => ({...state, token: res}))
          //   })
          //   getBalance(blockchain.usdtContract).then(res => {
          //     setUserBalances(state => ({...state, usdt: res}))
          //   })
          //   break
        }
      }
    }
    getUserBalances()
  }, [wallet, current?.address, blockchain, type])

  useEffect(() => {
    if (!loading && current?.address) {
      if (currentTab === 'buy') {
        setInitialPrice(prevProps?.price || lowestBuy?.price || current?.price)
      } else {
        setInitialPrice(prevProps?.price || lowestSell?.price || current?.price)
      }
    }
  }, [loading, current?.address, prevProps?.price, lowestBuy, lowestSell])

  useEffect(() => {
    if (prevProps?.side) {
      handleChangeTab(prevProps?.side)
    }
  }, [prevProps])

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
    <App.Flex column className={cn(styles.container, {[styles[version]]: version})}>
      <Tabs
        options={TAB_OPTIONS}
        active={currentTab}
        version={version}
        onChange={handleChangeTab}
      />

      {type === 'nfts' ? (
        <App.Flex gap={16} sx={{padding: '24px 16px'}}>
          <App.Button className={cn(styles.formTypeButton, {[styles.active]: formType === 'limit'})} onClick={handleChangeFormType('limit')}>
            {formType === 'limit' ? <App.Icon icon="check" /> : null}
            <App.Text color={formType === 'limit' ? '#fff' : '#5E5C6B'} weight={600} size={12}>Place Order</App.Text>
          </App.Button>

          <App.Button className={cn(styles.formTypeButton, {[styles.active]: formType === 'market'})} onClick={handleChangeFormType('market')}>
            {formType === 'market' ? <App.Icon icon="check" /> : null}
            <App.Text color={formType === 'market' ? '#fff' : '#5E5C6B'} weight={600} size={12}>{currentTab === 'buy' ? 'Buy ' : 'Sell ' }Now</App.Text>
          </App.Button>
        </App.Flex>
      ) : null}

      {(type => {
        switch (type) {
          case 'nfts':
            return (
              formType === 'market' ? (
                <TradeFormMarket
                  current={current}
                  type={type}
                  initialForm={marketForm}
                  userBalances={userBalances}
                  currentTab={currentTab}
                  currentOption={currentOption}
                />
              ) : (
                <TradeFormLimit
                  current={current}
                  type={type}
                  currentTab={currentTab}
                  currentOption={currentOption}
                  userBalances={userBalances}
                  initialForm={limitForm}
                />
              )
            )

          case 'tokens':
            return (
              <TradeFormToken
                ref={tokenFormRef}
                current={current}
                version={version}
                userBalances={userBalances}
                currentTab={currentTab}
                formOption={currentOption}
                prevProps={prevProps}
                onSubmit={onSubmit}
              />
            )
        }
      })(type)}
    </App.Flex>
  )
})

const isEqual = (prev, next) => {
  return JSON.stringify(prev.current) === JSON.stringify(next.current)
}

export default memo(TradeForm, isEqual)
