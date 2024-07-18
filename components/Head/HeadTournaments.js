import Head from 'next/head'

const HeadTournaments = () => {
  const getTitle = () => {
    return 'Trade & Win Tokens | Tegro Tournaments'
  }

  const getDescription = () => {
    return 'Trade on Tegro order book DEX to collect gems and win top Base layer 2 tokens like BRETT, TOSHI, USDC, WETH, and more!'
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
        <meta property="og:image" content="https://tegro.com/images/boomer-og.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tegro.com" />
        <meta property="twitter:url" content={getUrl()} />
        <meta name="twitter:title" content={getTitle()} />
        <meta name="twitter:description" content={getDescription()} />
        <meta name="twitter:image" content="https://tegro.com/images/boomer-og.jpg" />
      </Head>
  )
}

export default HeadTournaments