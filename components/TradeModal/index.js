import { useDispatch } from 'react-redux'
import { SwapWidget } from '@uniswap/widgets'

import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'

import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const TradeModal = ({ token, tokens }) => {
  const { network } = useWalletConnect()
  const dispatch = useDispatch()

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
        <SwapWidget theme={theme} defaultChainId={chainId} defaultOutputTokenAddress={token.nft20} tokenList={getTokenList()} brandedFooter={false} hideConnectionUI={true} />
      </div>
    </div>
  )
}

export default TradeModal