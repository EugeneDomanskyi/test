import styles from './styles.module.scss'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getClient, Execute } from "@reservoir0x/reservoir-sdk";
import { createWalletClient, http } from 'viem'

import $collection from '@/store/collection'
import $app from '@/store/app'
import $exchange from '@/store/exchange'
import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade';

import App from '@/components/App'
import Tabs from '@/components/Exchange/Tabs'

const TAB_OPTIONS = [
  {key: 'buy', title: 'BUY', color: 'rgb(13, 198, 109)'},
  {key: 'sell', title: 'SELL', color: 'rgb(206, 22, 93)'},
]

const TradeForm = ({collectionId}) => {

  const { wallet, walletClient, usdt, getBalance } = useWalletConnect()
  const { getNftBalanceUser, getNftUser } = useTrade()
  const currentCollection = useSelector($collection.get.collection('address', collectionId))
  const blockchain = useSelector($app.get.blockchain)
  const orderBook = useSelector(({$exchange}) => {
    return {
      buy: $exchange.orderBook.buy.slice(0, 10),
      sell: $exchange.orderBook.sell.slice(0, 10),
    }
  })

  const [userBalances, setUserBalances] = useState({usdt: 0, token: 0})
  const [form, setForm] = useState({price: '0', amount: '0', total: '0'})
  const [currentTab, setCurrentTab] = useState('buy')

  const currentOption = TAB_OPTIONS.find(opt => opt.key === currentTab)
  const [lowestBuy] = orderBook.buy
  const [lowestSell] = orderBook.sell

  useEffect(() => {
    (async () => {
      const nftBalance = await getNftBalanceUser(collectionId, wallet)
      const usdtBalance = await getBalance(usdt[blockchain.code])
      setUserBalances({
        usdt: usdtBalance,
        token: nftBalance,
      })
      // console.log(nftBalance, uisdtBalance)
    })()
  }, [blockchain, wallet, collectionId])

  useEffect(() => {
    if (lowestBuy) {
      setForm(state => ({...state, price: lowestBuy.price}))
    }
  }, [lowestBuy])

  const handleChangeTab = tab => {
    setCurrentTab(tab)
  }

  const handleChangeForm = field => value => {
    setForm(state => ({
      ...state,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    getClient()?.actions.placeBid({
      bids: [{  
          weiPrice: `${form.price*1000000000000000000}`,
          orderbook: 'reservoir',  
          orderKind: 'seaport-v1.5',
          collection: collectionId,
          quantity: form.amount,
          currency: usdt[blockchain.code],
          // token: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d:0"  
      }],
      wallet: walletClient,
      onProgress: (steps) => {
        console.log(steps)
      }
    })
    // const signer = createWalletClient({
    //   account: wallet,
    //   transport: http()
    // })
    // const prices = getNftPricesNative(collectionId)
    // console.log(prices)
  }

  const placeBid = () => {
    getClient()?.actions.placeBid({
      bids: [{  
          weiPrice: `${form.price*1000000000000000000}`,
          // orderbook: 'reservoir',
          orderKind: 'seaport-v1.5',
          collection: collectionId,
          quantity: form.amount,
          currency: usdt[blockchain.code],
      }],
      wallet: walletClient,
      onProgress: (steps) => {
        console.log(steps)
      }
    })
  }

  const placeAsk = async () => {
    const tokenIds = await getNftUser(collectionId, wallet)
    if (!tokenIds.length) {
      return
    }
    const listing = tokenIds.map((token) => ({
      token: '',
      weiPrice:`${form.price*1000000000000000000}`,
      orderKind: "seaport-v1.5",
    }))
    getClient()?.actions.listToken({
      listings: listing,
      wallet: walletClient,
      onProgress: (steps) => {
        console.log(steps)
      }
    })
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
            onChange={handleChangeForm('amount')} />
        </App.Flex>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Total</App.Text>
          <App.TextField
            value={form.total}
            onChange={handleChangeForm('total')} />
        </App.Flex>
        <App.Button variant={currentTab === 'buy' ? 'success' : 'danger'} sx={{marginTop: 'auto', backgroundColor: currentOption.color}} onClick={handleSubmit}>
          <App.Text>{ currentOption.title }</App.Text>
        </App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default TradeForm
