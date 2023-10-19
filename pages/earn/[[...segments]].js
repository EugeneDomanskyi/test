import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hexToString } from 'viem'
import { Web3Storage } from 'web3.storage'
import moment from 'moment'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import Head from 'next/head'

import useWalletConnect from '@/myhooks/wallet-connect'
import AlchemyLibrary from '@/libs/alchemy.lib'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $raffle from '@/store/raffle'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

const getApolloClient = (blockchain) => {
  const uri = blockchain?.raffle?.subgraph
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  return client
}

const RafflePage = () => {
  const { wallet, changeNetwork } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector($app.get.pageBlockchains('raffle'))

  const [campaignLoading, setCampaignLoading] = useState(true)

  const apollo = useRef()
  const alchemy = useRef()

  const prevWallet = useRef()
  const reward = useRef()

  // const requiredChain = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'mumbai' : 'polygon'
  const requiredChain = 'polygon'

  useEffect(() => {
    trackEvent('Visit Raffle')
  }, [])

  useEffect(() => {
    if (blockchain.code) {
      if ( ! pageBlockchains.map(item => item.code).includes(blockchain.code) || blockchain.code != requiredChain) {
        dispatch($app.set.code(requiredChain))
      }
    }
  }, [blockchain.code])
  
  useEffect(() => {
    if (blockchain.code == requiredChain) {
      (async () => {
        apollo.current = getApolloClient(blockchain)
        const result = await apollo.current.query({
          query: $raffle.query.campaigns,
        })

        if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('campaigns')) {
          const campaigns = await getIpfsInfo(result.data.campaigns)
          dispatch($raffle.set.all(campaigns.map(item => ({
            ...item,
            rewardAmount: item.rewardAmount / Math.pow(10, 6),
            totalTransferred: item.totalTransferred / Math.pow(10, 6),
            status: getStatus(item),
          }))))
        }

        const last = await apollo.current.query({
          query: $raffle.query.last,
        })

        if (last && last.hasOwnProperty('data') && last.data.hasOwnProperty('userCampaignParticipants')) {
          dispatch($raffle.set.last(last.data.userCampaignParticipants.map(item => ({
            resolvedTransaction: item.resolvedTransaction,
            rewardAmount: item.rewardAmount / Math.pow(10, 6),
            address: item.user.id.slice(0, 4) + '...' + item.user.id.slice(-4),
          }))))
        }

        setCampaignLoading(false)
      })()
    }
  }, [blockchain.code])

  useEffect(() => {
    if (wallet && ! campaignLoading && blockchain.code == requiredChain) {
      (async () => {
        if (wallet != prevWallet.current) {
          dispatch($raffle.set.reset())
          prevWallet.current = wallet
        }

        alchemy.current = new AlchemyLibrary(blockchain.raffle.alchemy)

        await getUserCases()
        await getUserTKeysBalance()

        dispatch($raffle.set.loadingUser(false))
      })()
    } else {
      prevWallet.current = null
    }
  }, [wallet, campaignLoading, blockchain.code])

  const getUserSummary = async (hard = false) => {
    if (hard) {
      apollo.current = getApolloClient(blockchain)
    }

    const result = await apollo.current.query({
      query: $raffle.query.user,
      variables: {
        id: wallet,
      },
    })

    if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('user')) {
      const user = result.data.user
      if (user) {
        dispatch($raffle.set.user({
          ...user,
          totalEarned: user.totalEarned / Math.pow(10, 6),
        }))
      }
    }
  }

  const getUserCases = async (hard = false) => {
    if (hard) {
      apollo.current = getApolloClient(blockchain)
    }

    const participants = await apollo.current.query({
      query: $raffle.query.userCampaignParticipants,
      variables: {
        id: wallet,
      },
    })

    if (participants && participants.hasOwnProperty('data') && participants.data.hasOwnProperty('userCampaignParticipants')) {
      const result = []
      const campaigns = participants.data.userCampaignParticipants
      for (const item of campaigns) {
        if ( ! item.isResolved) {
          reward.current = null
          await fetchReward(item.participatedTransaction)

          result.push({
            ...item,
            rewardAmount: reward.current,
          })
        } else {
          result.push(item)
        }
      }

      dispatch($raffle.set.participants(result))
    }
  }

  const getUserTKeysBalance = async () => {
    const network = await changeNetwork(blockchain.code)
    if ( ! network) {
      return
    }

    const balance = await alchemy.current.getNftsForOwnerCollectionCount(wallet, blockchain.raffle.contract)
    dispatch($raffle.set.balance(balance))
  }

  const getUserTKeys = async (limit = 100) => {
    const network = await changeNetwork(blockchain.code)
    if ( ! network) {
      return
    }

    const nfts = await alchemy.current.getNftsForOwnerCollection(wallet, blockchain.raffle.contract, limit)
    const ids = nfts.map(item => item.id)
    dispatch($raffle.set.tokenIds(ids))
    return ids
  }

  const fetchReward = async (participatedTransaction, maxTries = 3) => {
    if (maxTries > 0) {
      const result = await $raffle.api.reward(participatedTransaction.trim())
      if (result) {
        const parsedRes = JSON.parse(result.data)
        if (parsedRes[participatedTransaction].hasOwnProperty('expectedRewardAmount') || parsedRes[participatedTransaction].hasOwnProperty('rewardAmount')) {
          const rewardAmount = parsedRes[participatedTransaction]?.expectedRewardAmount ?? parsedRes[participatedTransaction]?.rewardAmount ?? 0
          reward.current = rewardAmount
        } else {
          setTimeout(() => {
            fetchReward(participatedTransaction, (maxTries - 1))
          }, 2000)
        }
      }
    }
  }

  const getIpfsInfo = async (campaigns) => {
    const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY })
    const promises = campaigns.map(item => {
      const hash = hexToString(item.ipfsHash)
      return client.get(hash)
    })

    const result = []
    const responses = await Promise.all(promises)
    for (const index in responses) {
      const response = responses[index]
      if (response.ok) {
        const cid = response.url.split('/').pop()
        const files = await response.files()
        const file = files.find(item => item.name == 'info.json')
        if (file) {
          const info = await readIpfsInfo(file)
          const campaign = campaigns[index]
          result.push({
            ...campaign,
            ...info,
          })
        }
      } else {
        result.push({
          id: 0,
          ipfsHash: '0x00',
          rewardAmount: 100000000,
          totalTransferred: 0,
          tKeyRequired: 3,
          status: 'ACTIVE',
          startTimestamp: 1695204437,
          endTimestamp: 1695215237,
          title: 'Unknown Campaign',
          image: '/images/raffle/usdt.png',
        })
      }
    }

    return result
  }

  const readIpfsInfo = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
  
      reader.addEventListener('load', (e) => {
        const fileContent = e.target.result
        const parsedContent = JSON.parse(fileContent)
        parsedContent.odds = parsedContent.rewardRange
        delete parsedContent.rewardRange
        resolve(parsedContent)
      });
  
      reader.addEventListener('error', (error) => {
        reject(error)
      });
  
      reader.readAsText(file)
    })
  }

  const getStatus = (item) => {
    const start = item.startTimestamp * 1000
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    
    if (item.status.toLowerCase() == 'active') {
      if (current >= start) {
        if (current >= end) {
          return 'Closed'
        } else {
          if (item.totalTransferred * 1 >= item.rewardAmount * 1) {
            return 'Closed'
          }
          return 'Active'
        }
      } else {
        return 'Upcoming'
      }
    } else {
      return 'Closed'
    }
  }

  return (
    <>
      <Head>
        <title>$10,000+ Tegro Treasure Case Series Live Now! | Tegro Earn</title>
        <meta content="Join the $10,000+ Tegro Treasure Case Series today! Complete trading objectives to obtain TKeys and unlock cases to win exciting $USDT, $PEPE, $SHIB, $FLOKI, and other token rewards! Enter now." property="description" key="description" />
        <meta property="og:image" content="https://tegro-imagekit-tora.s3.eu-central-1.amazonaws.com/images/tegro-earn.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@TegroFi" />
        <meta name="twitter:title" content="$10,000+ Tegro Treasure Case Series Live Now! | Tegro Earn" />
        <meta name="twitter:description" content="Join the $10,000+ Tegro Treasure Case Series today! Complete trading objectives to obtain TKeys and unlock cases to win exciting $USDT, $PEPE, $SHIB, $FLOKI, and other token rewards! Enter now." />
        <meta name="twitter:image" content="https://tegro-imagekit-tora.s3.eu-central-1.amazonaws.com/images/tegro-earn.jpg" />
      </Head>
      
      <App.Flex column>
        <Raffle.Top loading={campaignLoading} />
        <Raffle.Banner />
        <Raffle.List loading={campaignLoading} onUpdateUserCases={getUserCases} onUpdateUserTKeys={getUserTKeys} getUserTKeysBalance={getUserTKeysBalance} />
      </App.Flex>
    </>
  )
}

export default RafflePage