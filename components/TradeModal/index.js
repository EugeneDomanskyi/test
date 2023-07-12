import { useEffect, useState } from 'react'
import { useSigner } from 'wagmi'
import { SwapWidget } from '@uniswap/widgets'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const TradeModal = ({ token }) => {
  const { network } = useWalletConnect()
  const { data } = useSigner()

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

  useEffect(() => {
    if (data?.provider) {
      setProvider(data.provider)
    }
  }, [data])

  const getTokenList = () => {
    return `${process.env.NEXT_PUBLIC_S3_URL}/tokenlist.json`
  }

  const handleError = (error) => {
    console.log(error)
  }

  return provider ? (
    <App.Flex center className={styles.content}>
      <SwapWidget
        theme={theme}
        provider={provider}
        onError={handleError}
        defaultChainId={chainId}
        defaultInputTokenAddress={token.nft20}
        defaultOutputTokenAddress={USDT[token.chain.toLowerCase()]}
        tokenList={getTokenList()}
        hideConnectionUI={true}
        brandedFooter={false}
      />
    </App.Flex>
  ) : null
}

export default TradeModal