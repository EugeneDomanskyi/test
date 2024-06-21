import nookies from 'nookies'
import { Chain, Hex, PrivateKeyAccount, WalletClient, createPublicClient, createWalletClient, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { http } from 'wagmi'
import { disconnect, getAccount, getChainId, readContract, signMessage, signTypedData, simulateContract, switchChain, watchAccount, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, rainbowWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets'
import * as wagmiChains from 'wagmi/chains'

import $app from '@/store/app'

const wagmiChainsValues = Object.values(wagmiChains)

class WagmiHelper {
  debugMode: boolean = true
  backendChains: Array<any> = []
  wagmiConfig: any = {}
  appWallet: PrivateKeyAccount
  wpk: Hex
  publicClient: any
  walletClient: WalletClient

  connectSuccessMethod: Function
  connectFailedMethod: Function

  filteredChains = (domain: string, chains: any) => {
    let chainsCodes = []
    switch (domain) {
      case 'localhost:3000':
        chainsCodes = ['amoy', 'optimism', 'base', 'arbitrum']
        break
      case 'tegro.com':
        chainsCodes = ['base']
        break
      case 'testnet.tegro.com':
        chainsCodes = ['base', 'amoy', 'optimism']
        break
      case 'beta.tegro.com':
        chainsCodes = ['base', 'amoy', 'optimism']
        break
      default: 
        chainsCodes = ['amoy', 'optimism', 'base', 'arbitrum']
        break
    }

    return chains.filter((chain: any) => chainsCodes.includes(chain.code)).sort((a: any, b: any) => chainsCodes.indexOf(a.code) - chainsCodes.indexOf(b.code))
  }

  fetchChains = async (ctx: any) => {
    if (!this.backendChains.length) {
      const result = await $app.api.chains()
      if (result?.success) {
        this.backendChains = result.data.filter((item: any) => item.Active).map((item: any) => {
          const image = item.logo
            || (item.default_quote_token_symbol == 'USDT' ? '/images/icon-usdt.png' : '')
            || (item.default_quote_token_symbol == 'USDC' ? '/images/icon-usdc.png' : '')
            || `https://storage.googleapis.com/token-assets/assets/${item?.name}/${item.default_quote_token_contract_address.toLowerCase()}.png`

          return {
            id: item.id,
            code: item.name,
            native: {
              symbol: item.native_token_symbol,
              id: item.native_token_symbol_id,
              price: item.native_token_price,
            },
            token: {
              symbol: item.default_quote_token_symbol,
              address: item.default_quote_token_contract_address.toLowerCase(),
              image,
            },
            contract: {
              exchange: item.exchange_contract.toLowerCase(),
              settlement: item.settlement_contract.toLowerCase(),
            },
            info: {
              fee: item.fee * 100,
              min_order_value: item.min_order_value,
              gas_per_trade: item.gas_per_trade,
              gas_price: item.gas_price,
              gas_limit: item.default_gas_limit,
            },
          }
        })
      }
    }

    nookies.set(ctx, 'backendChains', JSON.stringify(this.backendChains), {path: '/'})
    const fullInfoChains = this.getFullInfoChains(this.backendChains)

    // return this.filteredChains(ctx.req.headers.host, fullInfoChains)
    return fullInfoChains
  }

  getCurrentChainCode = (ctx: any, chains: Array<any> = []) => {
    const [_, page, queryChainCode] = ctx.req.url.split('/')
    let currentChainCode = (page != '_next' ? queryChainCode : null) ?? nookies.get(ctx)?.currentChainCode
    if (!currentChainCode) {
      currentChainCode = chains[0]?.code
    } else {
      if (chains.length && !chains.some(item => item.code == currentChainCode)) {
        currentChainCode = chains[0]?.code
      }
    }

    nookies.set(ctx, 'currentChainCode', currentChainCode, {path: '/'})
    return currentChainCode
  }

  getBackendChains = (ctx?: any) => {
    const backendChainsJson = nookies.get(ctx)?.backendChains
    if (backendChainsJson) {
      return JSON.parse(backendChainsJson)
    }

    return []
  }

  createWagmiConfig = (chains: Array<any>) => {
    if (!this.wagmiConfig.hasOwnProperty('state')) {
      if (!chains.length) {
        chains = this.getBackendChains()
      }

      const inChains = wagmiChainsValues
        .filter((chain: any) => chains.some((c: any) => c.id === chain.id))
        .sort((a: any, b: any) => {
          const indexA = chains.findIndex((c: any) => c.id === a.id)
          const indexB = chains.findIndex((c: any) => c.id === b.id)
          return indexA - indexB
        })

      const notInChains = wagmiChainsValues
        .filter((chain: any) => !chains.some((c: any) => c.id === chain.id))

      const sortedWagmiChains = [...inChains, ...notInChains]

      coinbaseWallet.preference = 'all'

      this.wagmiConfig = getDefaultConfig({
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        chains: sortedWagmiChains as any,
        ssr: true,
        transports: sortedWagmiChains.reduce((acc, chain) => {
          return {
            ...acc,
            [chain.id]: http(),
          }
        }, {}),
        wallets: [
          {
            groupName: "Popular",
            wallets: [metaMaskWallet, rainbowWallet, coinbaseWallet, walletConnectWallet],
          },
        ],
      })
    }

    return this.wagmiConfig
  }

  getChainByCode = (chainCode?: string, chains: Array<any> = []) => {
    if (!chainCode) {
      chainCode = nookies.get()?.currentChainCode
    }

    if (!chains.length) {
      const backendChains = this.getBackendChains()
      chains = this.getFullInfoChains(backendChains)
    }

    return chains.find((item: any) => item.code == chainCode)
  }

  getFullInfoChains = (backendChains: Array<any>) => {
    return backendChains.map((backendChain: any) => {
      const correctChainKey = Object.keys(wagmiChains).find((key: string) => wagmiChains[key].id == backendChain.id)
      if (correctChainKey) {
        const fullInfoChain = {
          ...wagmiChains[correctChainKey],
          ...backendChain,
        }

        if (correctChainKey == 'polygonAmoy') {
          fullInfoChain.contracts = {
            multicall3: {
              address: '0xca11bde05977b3631167028862be2a173976ca11',
              blockCreated: 3127388,
            },
          }
        }

        return fullInfoChain
      }

      return backendChain
    })
  }

  changeChain = async (newChainCode: string) => {
    if (this.appWallet) {
      const chain = this.walletClient?.chain
      return chain.hasOwnProperty('id')
    }

    const currentChainId = getChainId(this.wagmiConfig)
    const newChain = this.getChainByCode(newChainCode)
    if (newChain) {
      if (currentChainId == newChain?.id) {
        return true
      }

      try {
        console.log('Change Chain - wagmi Config Chains length', this.wagmiConfig.chains.length)
        const result = await switchChain(this.wagmiConfig, { chainId: newChain.id })
        return result.hasOwnProperty('id')
      } catch (error) {
        this.error('Change chain failed', error)
        return false
      }
    } else {
      this.error(`Chain code "${newChainCode}" is missing in chains`)
      return false
    }
  }

  disconnect = async () => {
    try {
      await disconnect(this.wagmiConfig)
    } catch (error) {
      this.error('Disconnect failed', error)
    }
  }

  getWallet = () => {
    if (this.appWallet) {
      return this.appWallet.address.toLowerCase()
    }

    try {
      const account = getAccount(this.wagmiConfig)
      if (account.isConnected && account.address) {
        return account.address.toLowerCase()
      }
    } catch (error) {
      this.error('Wallet failed', error)
    }

    return null
  }

  setConnectCallbacks = (resolve: Function, reject: Function) => {
    this.connectSuccessMethod = resolve
    this.connectFailedMethod = reject
  }

  connectSuccess = () => {
    const wallet = this.getWallet()
    if (wallet && this.connectSuccessMethod) {
      this.connectSuccessMethod(wallet)
    } else {
      this.error('Connection failed')
    }
  }

  watchConnection = (callback: Function) => {
    return watchAccount(this.wagmiConfig, {
      onChange(data: any) {
        const result = {
          loading: true,
          connected: false,
        }

        if (data.isConnecting || data.isReconnecting) {
          result.loading = true
          result.connected = false
        } else {
          if (data.isConnected || data.isDisconnected) {
            result.loading = false
            result.connected = data.isConnected
          }
        }

        callback(result)
      },
    })
  }

  getConfigChainId = () => {
    try {
      return this.wagmiConfig.state.chainId
    } catch (error) {
      this.error('Get config chain id failed', error)
      return null
    }
  }

  generateScanUrl = (hash: string, type: string = 'tx', chain?: any) => {
    if (!chain) {
      chain = this.getChainByCode()
    }

    let url = chain?.blockExplorers?.default?.url
    if (url && !url.endsWith('/')) {
      url += '/'
    }

    return url ? `${url}${type}/${hash}` : hash
  }

  signMessage = async (message?: string) => {
    const wallet = this.getWallet() as `0x${string}`
    if (!message) {
      message = wallet
    }

    try {
      let result = null
      if (this.appWallet) {
        result = await this.appWallet.signMessage({ message })
      } else {
        result = await signMessage(this.wagmiConfig, {
          account: wallet,
          message,
        })
      }
      return result
    } catch (error) {
      this.error('Sign message failed', error)
      return null
    }
  }

  getConnectorInfo = () => {
    const defaultValue = {
      name: 'Unknown',
      logo: '/images/default-wallet-logo.png',
    }

    try {
      const account = getAccount(this.wagmiConfig)
      if (account?.connector) {
        defaultValue.name = account.connector?.id ?? ''

        switch (account.connector?.id) {
          case 'metaMask': return {name: 'MetaMask', logo: '/images/metamask-logo.png'}
          case 'walletConnect': return {name: 'WalletConnect', logo: '/images/walletconnect-logo.png'}
          case 'magic': return {name: 'Magic.Link', logo: '/images/magic-logo.png'}
          case 'rainbow': return {name: 'Rainbow', logo: '/images/rainbow-logo.png'}
          case 'coinbase': return {name: 'CoinBase', logo: '/images/coinbase-logo.png'}
          case 'brave': return {name: 'Brave', logo: '/images/brave-logo.png'}
          case 'safe': return {name: 'Safe', logo: '/images/safe-logo.png'}
          default: return defaultValue
        }
      }
    } catch (error) {
      this.error('Get connector info failed', error)
    }

    return defaultValue
  }

  signTypedData = async (typedData: any) => {
    try {
      let result = null
      if (this.appWallet) {
        result = await this.appWallet.signTypedData(typedData)
      } else {
        result = await signTypedData(this.wagmiConfig, typedData)
      }
      return result
    } catch (error) {
      this.error('Sign typed data failed', error)
      return null
    }
  }

  getAllowance = async (contractAddress: `0x${string}`) => {
    const wallet = this.getWallet()
    const chain = this.getChainByCode()

    const abi = [{
      name: 'allowance',
      stateMutability: 'view',
      type: 'function',
      inputs: [{
        internalType: 'address',
        name: 'owner',
        type: 'address',
      }, {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      }],
      outputs: [{
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      }],
    }]

    const allowanceConfig = {
      address: contractAddress,
      abi,
      functionName: 'allowance',
      args: [
        wallet,
        chain.contract.exchange,
      ],
    }

    try {
      let result = null
      if (this.appWallet) {
        result = await this.publicClient.readContract(allowanceConfig)
      } else {
        result = await readContract(this.wagmiConfig, allowanceConfig)
      }

      return result
    } catch (error) {
      this.error('Get allowance failed', error)
      return null
    }
  }

  approveAmount = async (contractAddress: `0x${string}`, amount: number) => {
    const chain = this.getChainByCode()

    const abi = [{
      name: 'approve',
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [{
        internalType: 'address',
        name: 'spender',
        type: 'address',
      }, {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      }],
      outputs: [{
        internalType: 'bool',
        name: '',
        type: 'bool',
      }],
    }]

    const approveConfig = {
      address: contractAddress,
      abi,
      functionName: 'approve',
      args: [
        chain.contract.exchange,
        amount,
      ],
    }

    let config: any = {}
    try {
      if (this.appWallet) {
        config = await this.publicClient.simulateContract({...approveConfig, account: this.appWallet})
      } else {
        config = await simulateContract(this.wagmiConfig, approveConfig)
      }
    } catch (error) {
      this.error('Simulate contract failed', error)
      return null
    }

    try {
      let result = null
      if (this.appWallet) {
        result = await this.walletClient.writeContract(config.request)
        await this.publicClient.waitForTransactionReceipt({ hash: result })
      } else {
        result = await writeContract(this.wagmiConfig, config.request)
        await waitForTransactionReceipt(this.wagmiConfig, { hash: result })
      }

      return result
    } catch (error) {
      this.error('Approve amount failed', error)
      return null
    }
  }

  createAppWallet = (wpk: Hex, blockchain: Chain) => {
    if (this.wpk != wpk || !this.appWallet) {
      this.wpk = wpk
      try {
        this.appWallet = privateKeyToAccount(wpk)
      } catch (error) {
        this.error('PK to Account Failed', error)
        return false
      }
    }

    return this.createApWalletClients(blockchain)
  }

  createApWalletClients = (blockchain: Chain) => {
    if (this.publicClient?.chain && this.publicClient.chain.id != blockchain.id || !this.publicClient) {
      try {
        this.publicClient = createPublicClient({
          chain: blockchain,
          transport: http(),
        })
      } catch (error) {
        this.error('Create public client failed', error)
        return false
      }
    }

    if (this.walletClient?.chain && this.walletClient.chain.id != blockchain.id || !this.walletClient) {
      try {
        this.walletClient = createWalletClient({
          account: this.appWallet,
          chain: blockchain,
          transport: http(),
        }).extend(publicActions)
      } catch (error) {
        this.error('Create wallet client', error)
        return false
      }
    }

    return true
  }

  error = (...args: any[]) => {
    if (this.debugMode) {
      console.log(`!!! ${this.constructor.name} ->`, ...args)
    }
  }

  debug = (...args: any[]) => {
    if (this.debugMode) {
      console.log(`--- ${this.constructor.name} ->`, ...args)
    }
  }
}

export default new WagmiHelper()