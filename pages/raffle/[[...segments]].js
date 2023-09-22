import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hexToString } from 'viem'
import { Web3Storage } from 'web3.storage'
import moment from 'moment'
import { ApolloClient, InMemoryCache } from '@apollo/client'

import useWalletConnect from '@/myhooks/wallet-connect'
import Contracts from '@/libs/contracts.lib'

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

  const apollo = useRef(getApolloClient())
  const contracts = new Contracts()

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
          status: getStatus(item),
        }))))
      }

      const last = await apollo.current.query({
        query: $raffle.query.last,
      })

      if (last && last.hasOwnProperty('data') && last.data.hasOwnProperty('userCampaignParticipants')) {
        dispatch($raffle.set.last(last.data.userCampaignParticipants.map(item => ({
          transaction: item.transaction,
          rewardAmount: item.rewardAmount / Math.pow(10, 6),
          address: item.user.id.slice(0, 4) + '...' + item.user.id.slice(-4),
        }))))
      }
    })()
  }, [])

  useEffect(() => {
    if (wallet) {
      (async () => {
        await handleUpdateUser()
        dispatch($raffle.set.loadingUser(false))
      })()
    }
  }, [wallet])

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

    const campaigns = await apollo.current.query({
      query: $raffle.query.userCampaigns,
      variables: {
        id: wallet,
      },
    })

    if (campaigns && campaigns.hasOwnProperty('data') && campaigns.data.hasOwnProperty('userCampaigns')) {
      dispatch($raffle.set.update(campaigns.data.userCampaigns.map(item => ({
        campaignId: item.campaignId,
        tKeysSpent: item.tKeysSpent,
        totalEarned: item.totalEarned / Math.pow(10, 6),
        isResolved: item.user.campaignParticipated.length ? item.user.campaignParticipated[0].isResolved : null,
      }))))
    }

    const networkCode = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'mumbai' : 'polygon'
    const network = await changeNetwork(networkCode)
    if ( ! network) {
      return
    }

    const contractAddress = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? '0xddbe6cb6c57511e36e3fe6c06a2de92d196cda84' : '0xddbe6cb6c57511e36e3fe6c06a2de92d196cda84'
    const tempBalance = await contracts.balanceOfTkeys(wallet, contractAddress, 0)
    dispatch($raffle.set.balance(tempBalance))
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
        resolve(JSON.parse(fileContent))
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
      <Raffle.Header />
      <Raffle.Top />
      <Raffle.List onUpdateUser={handleUpdateUser} />
    </App.Flex>
  )
}

export default RafflePage