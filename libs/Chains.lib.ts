import { http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import * as wagmiChains from 'wagmi/chains'

import $app from '@/store/app'

const updatedWagmiChains = Object.values(wagmiChains).map((chain: any) => {
  if (chain.id == 80002) {
    chain.contracts = {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 3127388,
      },
    }
  }

  return chain
})

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: updatedWagmiChains as any,
  ssr: true,
  transports: updatedWagmiChains.reduce((acc, chain) => {
    return {
      ...acc,
      [chain.id]: http(),
    }
  }, {}),
})

class Chains {
  backendChains: any = []
  chains: any = []
  
  getChains = (domain: string, chains: any) => {
    let chainsCodes = []
    switch (domain) {
      case 'localhost:3000':
        chainsCodes = ['amoy', 'optimism', 'base', 'arbitrum']
        break
      case 'tegro.com':
        chainsCodes = ['base']
        break
      case 'testnet.tegro.com':
        chainsCodes = ['amoy', 'optimism']
        break
      case 'beta.tegro.com':
        chainsCodes = ['amoy', 'optimism']
        break
      default: 
        chainsCodes = ['amoy', 'optimism', 'base', 'arbitrum']
        break
    }

    return chains.filter((chain: any) => chainsCodes.includes(chain.code)).sort((a: any, b: any) => chainsCodes.indexOf(a.code) - chainsCodes.indexOf(b.code))
  }

  list = async (domain: string) => {
    if (!this.chains.length) {
      const backendChains = await this.fetchChains()
      const chains = backendChains.map((chain: any) => {
        const correctKey = Object.keys(wagmiChains).find((key: string) => wagmiChains[key].id == chain.id)
        if (correctKey) {
          const data = {
            ...wagmiChains[correctKey],
            ...chain,
          }

          if (correctKey == 'polygonAmoy') {
            data.contracts = {
              multicall3: {
                address: '0xca11bde05977b3631167028862be2a173976ca11',
                blockCreated: 3127388,
              },
            }
          }

          return data
        }

        return chain
      })

      this.chains = this.getChains(domain, chains)
    }

    return this.chains
  }

  fetchChains = async () => {
    if (!this.backendChains.length) {
      const result = await $app.api.chains()
      if (result?.success) {
        this.backendChains = result.data.filter((item: any) => item.Active).map((item: any) => {
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
              image: item.logo || (item.default_quote_token_symbol == 'USDT' ? '/images/icon-usdt.png' : '') || (item.default_quote_token_symbol == 'USDC' ? '/images/icon-usdc.png' : '') || `https://storage.googleapis.com/token-assets/assets/${item?.name}/${item.default_quote_token_contract_address.toLowerCase()}.png`
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

    return this.backendChains
  }

  codeById = (id: number) => {
    const correctKey = Object.keys(wagmiChains).find((key: string) => wagmiChains[key].id == id)
    if (correctKey) {
      return wagmiChains[correctKey].name
    }

    return null
  }

  chainByCode = async (code: string) => {
    const chains = await this.list(window ? window.location.hostname : null)
    const correctChain = chains.find((item: any) => item.code == code)
    if (correctChain) {
      return correctChain
    }

    return null
  }
}

export default new Chains()