import Head from 'next/head'

const HeadDefault = () => {
  const getTitle = () => {
    return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
  }

  const getDescription = () => {
    return 'Buy, sell, and trade Tokens or NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens and NFTs at the best prices.'
  }

  return (
    <Head>
      <title>{getTitle()}</title>
      <meta content={getDescription()} property="description" key="description" />
      <meta name="keywords" content="Blockchain Crypto Exchange, Cryptocurrency Exchange, Bitcoin Trading, Ethereum price trend, DEX, Decentralized Exchange, BTC price, ETH wallet, ETH price, MATIC price, Uniswap, dYdX, Pancakeswap" data-shuvi-head="true"></meta>
    </Head>
  )
}

export default HeadDefault