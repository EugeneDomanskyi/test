import { useEffect, useState } from 'react'
import { SwapWidget } from '@uniswap/widgets'

import useWalletConnect from '@/myhooks/wallet-connect'
import { getEthersSigner } from '@/libs/ethers-adapter'

import App from '@/components/App'

import styles from './styles.module.scss'

const TradeModal = ({ token }) => {
  const { network, usdt, jsonRpcEndpoints } = useWalletConnect()

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

  useEffect(() => {
    (async () => {
      const signer = await getEthersSigner({ chainId })
      if (signer?.provider) {
        setProvider(signer?.provider)
      }
    })()
  }, [chainId])

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
        jsonRpcUrlMap={jsonRpcEndpoints}
        onError={handleError}
        locale="en-US"
        defaultChainId={chainId}
        defaultInputTokenAddress={token.nft20}
        defaultOutputTokenAddress={usdt[token.chain.toLowerCase()]}
        tokenList={getTokenList()}
        hideConnectionUI={true}
        brandedFooter={false}
      />
    </App.Flex>
  ) : null
}

export default TradeModal