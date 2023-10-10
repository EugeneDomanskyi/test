import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hexToString } from 'viem'
import { Web3Storage } from 'web3.storage'
import moment from 'moment'
import { ApolloClient, InMemoryCache } from '@apollo/client'

import useWalletConnect from '@/myhooks/wallet-connect'
import Contracts from '@/libs/contracts.lib'
import AlchemyLibrary from '@/libs/alchemy.lib'

import $raffle from '@/store/raffle'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

import styles from './styles.module.scss'

const getApolloClient = () => {
  const uri = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'https://api.thegraph.com/subgraphs/name/gulshanweb3/raffle-mumbai' : 'https://api.thegraph.com/subgraphs/name/gulshanweb3/raffle-mumbai'
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

  const [campaignLoading, setCampaignLoading] = useState(true)

  const apollo = useRef(getApolloClient())
  const alchemy = new AlchemyLibrary(process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'MATIC_MUMBAI' : 'MATIC_MAINNET')

  const prevWallet = useRef()

  useEffect(() => {
    (async () => {
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
  }, [])

  useEffect(() => {
    if (wallet && ! campaignLoading) {
      (async () => {
        if (wallet != prevWallet.current) {
          dispatch($raffle.set.reset())
          prevWallet.current = wallet
        }

        await handleUpdateUser()
        dispatch($raffle.set.loadingUser(false))
      })()
    } else {
      prevWallet.current = null
    }
  }, [wallet, campaignLoading])

  const handleUpdateUser = async (hard = false) => {
    if (hard) {
      apollo.current = getApolloClient()
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

    const participants = await apollo.current.query({
      query: $raffle.query.userCampaignParticipants,
      variables: {
        id: wallet,
      },
    })

    if (participants && participants.hasOwnProperty('data') && participants.data.hasOwnProperty('userCampaignParticipants')) {
      dispatch($raffle.set.participants(participants.data.userCampaignParticipants))
    }

    const networkCode = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'mumbai' : 'polygon'
    const network = await changeNetwork(networkCode)
    if ( ! network) {
      return
    }

    const contractAddress = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? '0x9BFDfDac362f810ff15240045E600a7468CAf91C' : '0x9BFDfDac362f810ff15240045E600a7468CAf91C'
    const nfts = await alchemy.getNftsForOwnerCollection(wallet, contractAddress)
    dispatch($raffle.set.tokenIds(nfts.map(item => item.id)))
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
    <App.Flex column className={styles.container}>
      {/* <Raffle.Header /> */}
      <Raffle.Top loading={campaignLoading} />
      <Raffle.Banner />
      <Raffle.List loading={campaignLoading} onUpdateUser={handleUpdateUser} />
    </App.Flex>
  )
}

export default RafflePage