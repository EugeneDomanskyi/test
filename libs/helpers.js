import { watchMulticall } from '@wagmi/core'
import { formatUnits } from 'viem'

const ABI = [{
    constant: true,
    inputs:[{name: '_owner',type: 'address'}],
    name:"balanceOf",
    outputs:[{name: 'balance', type: 'uint256'}],
    payable: false,
    type: 'function'
}, {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function'
}]

export const subscribeToBalanceUpdates = (chainId, walletAddress, tokens, onUpdate) => {
    if (!walletAddress) {
        return null
    }
    const filteredTokens =  tokens.filter(a => Boolean(a))
    const contracts = filteredTokens.flatMap(tokenAddress => ([{
        address: tokenAddress,
        abi: ABI,
        functionName: 'decimals',
        chainId: chainId,
    },{
        address: tokenAddress,
        abi: ABI,
        functionName: 'balanceOf',
        args: [walletAddress],
        chainId: chainId,
    }]))
    const args = {
        contracts: contracts,
        listenToBlock: true,
    }
    const handleUpdate = data => {
        const result = data.reduce((acc, res, i, array) => {
            const isBalance = i%2
            if (isBalance) {
                const decimals = array[i-1].result
                return {
                    ...acc,
                    [filteredTokens[parseInt(i/2)]]: formatUnits(res.result, decimals)
                }
            }
            return acc
        }, {})
        onUpdate(result)
    }
    return watchMulticall(args, handleUpdate)
}