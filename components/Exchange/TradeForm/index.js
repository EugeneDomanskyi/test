import styles from './styles.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { parseUnits } from 'viem'
import numeral from 'numeral'

import $app from '@/store/app'
import $collection from '@/store/collection'
import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade'

import App from '@/components/App'
import Tabs from '@/components/Exchange/Tabs'

const TAB_OPTIONS = [
  {key: 'buy', title: 'BUY', color: 'rgb(13, 198, 109)'},
  {key: 'sell', title: 'SELL', color: 'rgb(206, 22, 93)'},
]

const TradeForm = ({collectionId}) => {

  const { wallet, connect, changeNetwork, getBalance } = useWalletConnect()
  const { getNftBalanceUser, getNftUser, placeBid, placeAsk, errorHandler } = useTrade()
  const currentCollection = useSelector($collection.get.collection('address', collectionId))
  const blockchain = useSelector($app.get.blockchain)
  const orderBook = useSelector(({$exchange}) => {
    return {
      buy: $exchange.orderBook.buy.slice(0, 10),
      sell: $exchange.orderBook.sell.slice(0, 10),
    }
  })

  const [userBalances, setUserBalances] = useState({native: 0, token: 0})
  const [form, setForm] = useState({price: '0', amount: '1', total: '0'})
  const [currentTab, setCurrentTab] = useState('buy')
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  const currentOption = TAB_OPTIONS.find(opt => opt.key === currentTab)
  const [lowestBuy] = orderBook.buy
  const [lowestSell] = orderBook.sell

  useEffect(() => {
    (async () => {
      if (collectionId && wallet) {
        const nftBalance = await getNftBalanceUser(collectionId, wallet)
        const nativeBalance = await getBalance()
        setUserBalances({
          native: nativeBalance,
          token: nftBalance,
        })
      }
    })()
  }, [blockchain, wallet, collectionId])

  useEffect(() => {
    if (currentTab === 'buy' && lowestBuy) {
      handleChangeForm('price')(lowestBuy.price)
    } else if (!lowestBuy && currentCollection?.price) {
      handleChangeForm('price')(currentCollection?.price)
    }
    if (currentTab === 'sell' && lowestSell) {
      handleChangeForm('price')(lowestSell.price)
    } else if (!lowestBuy && currentCollection?.price) {
      handleChangeForm('price')(currentCollection?.price)
    }
  }, [lowestBuy, lowestSell, currentCollection?.price, currentTab])

  const handleChangeTab = tab => {
    setCurrentTab(tab)
  }

  const handleChangeForm = field => value => {
    switch (field) {
      case 'price':
        setForm(state => ({
          ...state,
          price: value,
          total: (value*state.amount).toString(),
        }))
        return
      case 'amount':
        const regex = /^\d+[,]?\d{0,2}$/
        if (value && !regex.test(value)) {
          return 
        }
        setForm(state => ({
          ...state,
          amount: value,
          total: (value*state.price).toString(),
        }))
        return
      case 'total':
        setForm(state => ({
          ...state,
          total: value,
          amount: numeral(value/state.price).format('0')
        }))
        return
    }
  }

  const handleSubmit = async () => {
    const address = await connect()
    if (!address) {
      return
    }

    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }
    loadingRef.current = true
    if (currentTab === 'buy') {
      const bids = [{  
        weiPrice: parseUnits(`${form.total}`, 18).toString(),
        collection: collectionId,
        quantity: form.amount,
      }]
      placeBid(bids, progressHandler, errorHandler)
      return
    }
    const tokenIds = await getNftUser(collectionId, wallet)
    if (!tokenIds.length) {
      return
    }
    const listing = tokenIds.filter((_, i) => i < form.amount).map((token) => ({
      token: `${collectionId}:${token.token.tokenId}`,
      weiPrice: parseUnits(`${form.price}`, 18).toString(),
      orderKind: "seaport-v1.5",
      quantity: 1,
    }))
    placeAsk(listing, progressHandler, errorHandler)
  }

  const progressHandler = steps => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      toast.success('Order created successfully')
      loadingRef.current = false
    }
  }

  const renderBalance = () => {
    return (
      <App.Flex sx={{padding: '3px 0px'}}>
        <App.Text size={10} color="rgba(255,255,255,0.6)">Balance: { currentTab === 'buy' ? userBalances.native : userBalances.token }</App.Text>
      </App.Flex>
    )
  }

  return (
    <App.Flex className={styles.container} column>
      <Tabs
        options={TAB_OPTIONS}
        active={currentTab}
        onChange={handleChangeTab} />
      <App.Flex column className={styles.form}>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Price</App.Text>
          <App.TextField
            value={form.price}
            onChange={handleChangeForm('price')} />
        </App.Flex>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Amount</App.Text>
          <App.TextField
            value={form.amount}
            type="number"
            onChange={handleChangeForm('amount')} />
          {
            currentTab === 'sell'
              ? renderBalance()
              : null
          }
        </App.Flex>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Total</App.Text>
          <App.TextField
            value={form.total}
            onChange={handleChangeForm('total')} />
            {
              currentTab === 'buy'
                ? renderBalance()
                : null
            }
        </App.Flex>
        <App.Button
          variant={currentTab === 'buy' ? 'success' : 'danger'}
          sx={{marginTop: 'auto', backgroundColor: currentOption.color}}
          disabled={!form.total}
          onClick={handleSubmit}>
          <App.Text>{ currentOption.title } {`${form.amount || 0} NFT${form.amount > 1 ? `'s` : ''}` }</App.Text>
        </App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default TradeForm
