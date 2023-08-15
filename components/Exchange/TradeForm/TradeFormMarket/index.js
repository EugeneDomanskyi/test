import styles from './styles.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'

import useTrade from '@/myhooks/trade'
import $app from '@/store/app'
import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import OrderStruct from '@/libs/structs/Order'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const TradeFormMarket = ({current, currentTab, type, currentOption, userBalances, initialForm}) => {
  const dispatch = useDispatch()
  const { getNftPricesNative, getNftUser, getNftBids } = useTrade()
  const { wallet, connect, changeNetwork } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchainByCode(current?.blockchain))

  const [amount, setAmount] = useState(initialForm.amount)
  const [totalPrice, setTotalPrice] = useState('0')
  const [userNfts, setUserNfts] = useState([])
  const [onSaleNft, setOnSaleNft] = useState([])

  const fetchTimeout = useRef(null)

  const isDisabled = false // (!(amount*1) || (currentTab === 'buy' && !onSaleNft.length)) && type === 'nfts'

  useEffect(() => {
    setAmount(initialForm.amount)
  }, [initialForm.amount])

  useEffect(() => {
    if (current.address) {
      getNftPricesNative(current.address).then(res => {
        setOnSaleNft(res)
      })
      
      if (wallet) {
        getNftUser(current.address, wallet).then(res => {
          setUserNfts(res)
        })
      }
    }
  }, [current.address, wallet, blockchain?.code])

  useEffect(() => {
    setAmount('1')
  }, [currentTab, current.address])

  useEffect(() => {
    if (fetchTimeout.current) {
      clearTimeout(fetchTimeout.current)
    }
    if (current?.address) {
      if (type === 'tokens') {
        fetchTimeout.current = setTimeout(() => {
          OrderStruct.TOKEN.getQuote({
            chainId: blockchain.id,
            address: current.address,
            amount: amount,
            side: currentTab
          }).then(res => {
            setTotalPrice(res)
          })
        }, 1000)
      } else {
        fetchTimeout.current = setTimeout(() => {
          OrderStruct.NFT.getQuote({
            chainId: blockchain.id,
            address: current.address,
            amount: amount,
            side: currentTab
          }).then(res => {
            setTotalPrice(res)
          })
        }, 1000)
      }
    }
  }, [amount, type, currentTab, blockchain?.id, current?.address])

  const handleChangeAmount = value => {
    const decimalRegExp = type === 'nfts' ? /^\d*(?:\.\d+)?$/ : /^(?=.*\d)\d*(?:\.\d*)?$/
    if (!decimalRegExp.test(value) && value) {
      return
    }
    if (type === 'nfts') {
      const maxLength = currentTab === 'buy' ? onSaleNft.length : userNfts.length
      value = value*1 > maxLength ? maxLength : value
    }
    setAmount(value)
  }

  const handleBlurAmount = () => {
    trackEvent('Add Amount', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Amount': amount,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleChangeRange = value => {
    setAmount(value)
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
    switch (currentTab) {
      case 'buy':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/BuyModal',
          props: {
            header: {
              title: `Buy ${current.name} for ${type === 'nfts' ? blockchain.currency : 'USDT'}`,
            },
            data: {
              type: 'fulfill',
              amount: amount,
              price: totalPrice / amount,
              total: totalPrice,
              current: current,
              tokenType: type,
              blockchain: blockchain,
            },
          }
        }))
        break
      case 'sell':
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/SellModal',
          props: {
            header: {
              title: type === 'nfts' ? `${userNfts.length} NFTs available` : `Sell ${current.name} for USDT`,
              subtitle: type === 'nfts' ? `Choose the NFT collection you want to sell` : ''
            },
            data: {
              type: 'fulfill',
              amount: amount,
              price: totalPrice / amount,
              tokens: userNfts,
              current: current,
              tokenType: type,
              blockchain: blockchain,
            },
          }
        }))
        break
    }
  }

  return (
    <App.Flex column className={styles.form}>
      <App.Flex column sx={{marginBottom: 16}}>
        <TradeInput
          label="AMOUNT"
          value={amount}
          currency={type === 'nfts' ? `NFT${amount > 1 ? `s` : ''}` : (currentTab === 'buy' ? 'USDT' : current.symbol)}
          onBlur={handleBlurAmount}
          onChange={handleChangeAmount} />
        {
          type === 'nfts'
            ?  <App.Text color="#B9B8C5" size={10} sx={{marginLeft: 'auto', marginTop: 5}}>
                NFTs available: {currentTab === 'buy' ? onSaleNft.length : userNfts.length}
              </App.Text>
            : <App.Flex align="center" gap={4} className={styles.balance}>
                <App.Icon icon="wallet" />
                <App.Text color="#B9B8C5" size={10}>
                  {
                    currentTab === 'buy'
                      ? `${userBalances.usdt} ${'USDT'}`
                      : `${userBalances.token} ${current.symbol}`
                  }
                </App.Text>
              </App.Flex>
        }
      </App.Flex>
      {
        type === 'nfts'
          ? <App.Flex sx={{marginBottom: 24}}>
              <App.RangeInput
                value={amount*1}
                min={0}
                max={currentTab === 'buy' ? onSaleNft.length : userNfts.length}
                onChange={handleChangeRange}
                containerStyle={{width: '100%'}} />
            </App.Flex>
          : null
      }
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="TOTAL"
          currency={type === 'nfts' ? blockchain?.currency : (currentTab === 'buy' ? current.symbol : 'USDT')}
          readOnly={true}
          value={totalPrice} />
        <App.Flex align="center" gap={4} className={styles.balance}>
          <App.Icon icon="wallet" />
          <App.Text color="#B9B8C5" size={10}>
            {
              type === 'nfts'
                ? `${userBalances.native} ${blockchain?.currency}`
                : currentTab === 'buy'
                  ? `${userBalances.token} ${current.symbol}`
                  : `${userBalances.usdt} ${'USDT'}`
            }
          </App.Text>
        </App.Flex>
      </App.Flex>
      <App.Button
        sx={{backgroundColor: currentOption.color, opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'default' : 'pointer'}}
        className={styles.button}
        disabled={isDisabled}
        onClick={handleSubmit}>
        <App.Text color="#09051D" size={15} weight={700}>
          { currentOption.title } {`${amount || 0}` } { type === 'nfts' ? `NFT${amount > 1 ? `s` : ''}` : current.symbol }
        </App.Text>
        { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
      </App.Button>
    </App.Flex>
  )
}

export default TradeFormMarket
