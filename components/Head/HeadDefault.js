import Head from 'next/head'

const HeadDefault = () => {
  const getTitle = () => {
    return 'Tegro: The Gen2 DEX for High-frequency Trading'
  }

  const getDescription = () => {
    return 'Tegro is a Gen2 DEX for high-frequency trading with API bot access. Enjoy CEX-level efficiency on-chain with features like efficient orderbooks, unmatched gas efficiency, lightning-fast order matching, and more! Become a part of the next DeFi revolution. Join the Tegro Testnet and start trading for free today!'
  }

  const getUrl = () => {
    return `https://tegro.com/`
  }

  return (
    <Head>
      <title>{getTitle()}</title>
      <meta content={getDescription()} property="description" key="description" />
      <meta name="keywords" content="Blockchain Crypto Exchange, Cryptocurrency Exchange, Bitcoin Trading, Ethereum price trend, DEX, Decentralized Exchange, BTC price, ETH wallet, ETH price, MATIC price, Uniswap, dYdX, Pancakeswap" data-shuvi-head="true"></meta>

      <meta property="og:url" content={getUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={getTitle()} />
      <meta property="og:description" content={getDescription()} />
      <meta property="og:image" content="https://tegro.com/images/og-image.jpg" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="tegro.com" />
      <meta property="twitter:url" content={getUrl()} />
      <meta name="twitter:title" content={getTitle()} />
      <meta name="twitter:description" content={getDescription()} />
      <meta name="twitter:image" content="https://tegro.com/images/og-image.jpg" />
    </Head>
  )
}

export default HeadDefault