import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useProvider, useSigner } from 'wagmi'
import { SwapWidget } from '@uniswap/widgets'

import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'

import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const TradeModal = ({ token, tokens }) => {
  const { network } = useWalletConnect()
  const { data } = useSigner()
  const p = useProvider()
  const dispatch = useDispatch()

  const [provider, setProvider] = useState()

  const chainId = network(token.chain)?.chainId

  const theme = {
    borderRadius: {large: 0.5, medium: 0.5, small: 0.5, xsmall: 0.5},
    fontFamily: '"Gilroy"',
    container: '#08051C',
    dialog: '#08051C',
    primary: '#fff',
    secondary: '#fff',
    module: '#151a28',
    accent: '#7204FF',
    interactive: '#1D1937',
  }

  const USDT = {
    polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    ethereum: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    bnb: '0x55d398326f99059fF775485246999027B3197955',
  }

  const jsonRpcUrlMap = {
    1: [`https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`],
    56: [`https://bsc-dataseed1.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`],
    137: [`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`],
  }

  useEffect(() => {
    console.log(p)
    if (data?.provider) {
      setProvider(data.provider)
    }
  }, [data])

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const getTokenList = () => {
    return 'https://tegro-imagekit.s3.eu-central-1.amazonaws.com/tokenlist.json'

    const result = []
    for (const t of tokens) {
      if (t.nft20) {
        result.push({
          "name": t.collection,
          "address": t.nft20,
          "symbol": t.code,
          "decimals": t.decimals,
          "chainId": network(t.chain)?.chainId,
          "logoURI": t.image
        })
      }
    }

    return result
  }

  return (
    <div className={styles.walletModal}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleCloseModal}>
          <AppIcon icon="cross" color="#fff" />
        </div>
      </div>

      <div className={styles.content}>
        {provider ? (
          <SwapWidget theme={theme} provider={provider} jsonRpcUrlMap={jsonRpcUrlMap} defaultChainId={chainId} defaultInputTokenAddress={token.nft20} defaultOutputTokenAddress={USDT[token.chain.toLowerCase()]} tokenList={getTokenList()} brandedFooter={false} hideConnectionUI={true} />
        ) : null}
      </div>
    </div>
  )
}

export default TradeModal