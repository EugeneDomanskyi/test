import { prepareWriteContract, waitForTransaction, writeContract, readContract } from '@wagmi/core'

import abi from './abi.lib'

export const defaultOperator = '0x1E0049783F008A0085193E00003D00cd54003c71' // Use OpenSea operator for OpenSea contract
export const defaultContract = '0x0000000000c2d145a2526bD8C716263bFeBe1A72' // Use OpenSea contract
export const conduitKey = '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000'

export default function Contracts(defaultGasLimit = null) {
  const isDebugMode = process.env.NEXT_PUBLIC_APP_ENV != 'production'

  const methods = {
    debugMessage: (error, title = null) => {
      // if (isDebugMode) {
      //   if (title) {
      //     console.log('------>', title)
      //   }

      //   if (error) {
      //     for (const key in error) {
      //       console.log((key + ':'), error[key])
      //     }
      //   }
      // }

      return { error: error?.shortMessage || error?.message || error?.name || error }
    },

    prepareWriteContract: async (contractConfig, gasLimit = defaultGasLimit) => {
      const place = contractConfig?.functionName
      let errorCode = null
      let config = {}
      try {
        config = await prepareWriteContract(contractConfig)
      } catch (error) {
        errorCode = error?.code
        return methods.debugMessage(error, `Prepare "${place}"`)
      }

      if (errorCode) {
        if (errorCode == 'UNPREDICTABLE_GAS_LIMIT' && gasLimit) {
          try {
            contractConfig.gas = gasLimit
            config = await prepareWriteContract(contractConfig)
          } catch (error) {
            return methods.debugMessage({ message: errorCode })
          }
        }
      }

      return config
    },

    writeContract: async (config) => {
      const place = config?.functionName
      if (config?.mode == 'prepared') {
        try {
          const { hash } = await writeContract(config)
          return hash
        }
        catch (error) {
          return methods.debugMessage(error, `Write "${place}"`)
        }
      } else {
        return methods.debugMessage({ message: ('Prepare config.mode is ' + config?.mode) })
      }
    },

    readContract: async (config) => {
      try {
        const result = await readContract(config)
        return result
      }
      catch (error) {
        return methods.debugMessage(error, `Read`)
      }
    },

    waitForTransaction: async (hash) => {
      if (hash) {
        try {
          const result = await waitForTransaction({ hash })
          return result
        } catch (error) {
          return methods.debugMessage(error, 'Result "waitForTransaction"')
        }
      } else {
        return methods.debugMessage({ message: ('Tx hash is missing') })
      }
    },

    isApprovedForAll: async (contract, owner, operator = defaultOperator) => {
      const result = await methods.readContract({
        address: contract,
        abi: abi.tkeys.isApprovedForAll,
        functionName: 'isApprovedForAll',
        args: [
          owner,
          operator,
        ],
      })

      return result
    },

    setApprovalForAll: async (contract, operator = defaultOperator, approved = true) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.tkeys.setApprovalForAll,
        functionName: 'setApprovalForAll',
        args: [
          operator,
          approved,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    bulkTransfer: async (to, items, contract = defaultContract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc721.bulkTransfer,
        functionName: 'bulkTransfer',
        args: [
          [[
            items,
            to,
            true,
          ]],
          conduitKey,
        ]
      }, defaultGasLimit * items.length)

      const result = await methods.writeContract(config)
      return result
    },

    safeTransferFrom: async (from, to, id, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc721.safeTransferFrom,
        functionName: 'safeTransferFrom',
        args: [
          from,
          to,
          id,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    safeTransferFromERC1155: async (from, to, id, amount, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc1155.safeTransferFrom,
        functionName: 'safeTransferFrom',
        args: [
          from,
          to,
          id,
          amount,
          '0x',
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    safeBatchTransferFrom: async (from, to, ids, amounts, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc1155.safeBatchTransferFrom,
        functionName: 'safeBatchTransferFrom',
        args: [
          from,
          to,
          ids,
          amounts,
          '0x',
        ],
      }, defaultGasLimit * ids.length)

      const result = await methods.writeContract(config)
      return result
    },

    deposit: async (id, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc721.deposit,
        functionName: 'deposit',
        args: [
          id,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    balanceOf: async (wallet, contract) => {
      const result = await methods.readContract({
        address: contract,
        abi: abi.erc721.balanceOf,
        functionName: 'balanceOf',
        args: [
          wallet,
        ],
      })

      const decimals = await methods.readContract({
        address: contract,
        abi: abi.erc721.decimals,
        functionName: 'decimals',
        args: [],
      })

      return parseFloat(result) / Math.pow(10, decimals)
    },

    depositNFT: async (id, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc721.depositNFT,
        functionName: 'depositNFT',
        args: [
          id,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    depositNFTs: async (ids, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc721.depositNFTs,
        functionName: 'depositNFTs',
        args: [
          ids,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },

    withdrawNFTs: async (amount, contract) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc721.withdrawNFTs,
        functionName: 'withdrawNFTs',
        args: [
          amount,
        ],
      })

      const result = await methods.writeContract(config)
      return result
    },
    
    enterCampaign: async (contract, campaignId, tokenIds = []) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.tkeys.enterCampaign,
        functionName: 'enterCampaign',
        args: [
          campaignId,
          tokenIds
        ],
      })

      // if (config.error) {
      //   return config
      // }
      const result = await methods.writeContract(config)
      return result
    },

    balanceOfTkeys: async (wallet, contract, tokenId) => {
      const result = await methods.readContract({
        address: contract,
        abi: abi.tkeys.balanceOf,
        functionName: 'balanceOf',
        args: [
          wallet,
          tokenId,
        ],
      })

      return parseFloat(result)
    },

    getFreeToken: async (contract, tokenId) => {
      const config = await methods.prepareWriteContract({
        address: contract,
        abi: abi.erc20.getFreeToken,
        functionName: 'getFreeToken',
        args: [
          tokenId,
        ],
      })

      if (config?.error) {
        return config
      }

      const result = await methods.writeContract(config)
      return parseFloat(result)
    },

    nextClaimTime: async (wallet, contract, tokenId) => {
      const result = await methods.readContract({
        address: contract,
        abi: abi.erc20.nextClaimTime,
        functionName: 'nextClaimTime',
        args: [
          tokenId,
          wallet,
        ],
      })

      return Number(result)
    },

    tokens: async (contract, tokenId) => {
      const result = await methods.readContract({
        address: contract,
        abi: abi.erc20.tokens,
        functionName: 'tokens',
        args: [
          tokenId,
        ],
      })

      return result
    },
  }

  return methods
}