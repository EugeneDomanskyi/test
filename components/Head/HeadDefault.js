import Head from 'next/head'

const HeadDefault = ({currentPage, currentSymbol}) => {
  const getTitle = () => {
    if (!currentSymbol) {
      return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
    }
    switch (currentPage) {
      case 'nfts':
        return `${currentSymbol} Trading and Charts | Tegro: The CEX-DEX`
      case 'tokens':
        return `${currentSymbol}/USDT Trading and Charts | Tegro: The CEX-DEX`
      default:
        return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
    }
  }

  const getDescription = () => {
    if (!currentSymbol) {
      return 'Buy, sell, and trade Tokens or NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens and NFTs at the best prices.'
    }
    switch (currentPage) {
      case 'nfts':
        return `Buy, sell, and trade ${currentSymbol} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${currentSymbol} at the best prices.`
      case 'tokens':
        return `Buy, sell, and trade ${currentSymbol}/USDT instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${currentSymbol} at the best prices.`
      default:
        return 'Buy, sell, and trade Tokens or NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens and NFTs at the best prices.'
    }
  }

  return (
    <Head>
      <title>{getTitle()}</title>
      <meta content={getDescription()} property="description" key="description" />
    </Head>
  )
}

export default HeadDefault