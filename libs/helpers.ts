import { watchMulticall } from '@wagmi/core'
import { formatUnits } from 'viem'

enum Side {
    Buy = 'buy',
    Sell = 'sell',
}

interface TypedDataParams {
    chain_id: number;
    wallet_address: string;
    market_symbol: string;
    side: Side;
    price: number;
    amount: number;
}

interface LimitOrder {
    chain_id: number;
    base_asset: string;
    quote_asset: string;
    side: number;
    volume_precision: string;
    price_precision: string;
    order_hash: string;
    raw_order_data: string;
    signature: string;
    signed_order_type: string;
    market_id: string;
    market_symbol:string;
}

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

export const subscribeToBalanceUpdates = (chainId: number, walletAddress: string, tokens: [string], onUpdate: { (res: any): any }) => {
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
            if (!res?.result) {
                return acc
            }
            const isBalance = i%2
            if (isBalance) {
                const decimals = array[i-1].result
                return {
                    ...acc,
                    [filteredTokens[parseInt(i/2)]]: formatUnits(res?.result ?? '', decimals)
                }
            }
            return acc
        }, {})
        onUpdate(result)
    }
    return watchMulticall(args, handleUpdate)
}