import { simulateContract, writeContract, readContract, multicall, watchBlockNumber } from '@wagmi/core'
import { formatUnits } from 'viem'

import { wagmiConfig } from '@/libs/Chains.lib'
import abi from './abi.lib'

export default function Contracts(defaultGasLimit = null) {
  const isDebugMode = process.env.NEXT_PUBLIC_APP_ENV != 'production'

  const methods = {
    debugMessage: (error, title = null) => {
      if (isDebugMode) {
        if (title) {
          console.log('------>', title)
        }

        if (error) {
          for (const key in error) {
            console.log((key + ':'), error[key])
          }
        }
      }

      return { error: error?.shortMessage || error?.message || error?.name || error }
    },

    prepareWriteContract: async (contractConfig, gasLimit = defaultGasLimit) => {
      const place = contractConfig?.functionName
      let errorCode = null
      let config = {}
      try {
        config = await simulateContract(wagmiConfig, contractConfig)
      } catch (error) {
        errorCode = error?.code
        // return methods.debugMessage(error, `Prepare "${place}"`)
      }

      if (errorCode) {
        if (errorCode == 'UNPREDICTABLE_GAS_LIMIT' && gasLimit) {
          try {
            contractConfig.gas = gasLimit
            config = await simulateContract(wagmiConfig, contractConfig)
          } catch (error) {
            return methods.debugMessage({ message: errorCode })
          }
        }
      }

      return config
    },

    writeContract: async (config) => {
      const place = config?.request?.functionName
      if (config?.result) {
        try {
          const hash = await writeContract(wagmiConfig, config.request)
          return hash
        }
        catch (error) {
          return methods.debugMessage(error, `Write "${place}"`)
        }
      } else {
        return methods.debugMessage({ message: ('Prepare result is false') })
      }
    },

    readContract: async (config) => {
      try {
        const result = await readContract(wagmiConfig, config)
        return result
      } catch (error) {
        return methods.debugMessage(error, `Read`)
      }
    },

    allowance: async (wallet, contract, exchangeContract) => {
      const result = await methods.readContract({
        address: contract,
        abi: abi.erc20.allowance,
        functionName: 'allowance',
        args: [
          wallet,
          exchangeContract,
        ],
      })

      return result
    },

    approve: async (contract, exchangeContract, amount) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc20.approve,
        functionName: 'approve',
        args: [
          exchangeContract,
          amount,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    fetchBalance: async (wallet, contracts) => {
      const calls = contracts.flatMap((contract) => ([{
        address: contract,
        abi: abi.erc20.decimals,
        functionName: 'decimals',
        args: [],
      }, {
        address: contract,
        abi: abi.erc20.balanceOf,
        functionName: 'balanceOf',
        args: [
          wallet,
        ],
      }]))

      try {
        const data = await multicall(wagmiConfig, {
          contracts: calls,
        })

        const result = data.reduce((acc, response, i, array) => {
          BigInt.prototype.toJSON = function() { return this.toString() }
          if (!response.hasOwnProperty('result')) {
            return acc
          }

          const isBalance = i % 2
          if (isBalance) {
            const decimals = array[i - 1].result
            return {
              ...acc,
              [contracts[parseInt(i / 2)]]: formatUnits(response?.result ?? '', decimals)
            }
          }

          return acc
        }, {})

        return result
      } catch (error) {
        return methods.debugMessage(error, 'Fetch balance')
      }
    },

    watchBalance: async (wallet, contracts, callback) => {
      const unwatch = watchBlockNumber(wagmiConfig, {
        async onBlockNumber(newBlockNumber) {
          const result = await methods.fetchBalance(wallet, contracts)
          if (callback) {
            callback(result)
          }
        }
      })

      return unwatch
    },
  }

  return methods
}