import Head from 'next/head'

const HeadTournament = () => {
  const getTitle = () => {
    return 'Trade for FREE & Collect POINTS! | Tegro Earn'
  }

  const getDescription = () => {
    return 'Enter the Tegro Testnet and start trading for FREE. Collect points on every trade and climb the leaderboard to win exciting prizes!'
  }

  const getUrl = () => {
    return `https://testnet.tegro.com/`
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
        <meta property="og:image" content="/images/tournament/meta-image.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tegro.com" />
        <meta property="twitter:url" content={getUrl()} />
        <meta name="twitter:title" content={getTitle()} />
        <meta name="twitter:description" content={getDescription()} />
        <meta name="twitter:image" content="/images/tournament/meta-image.jpg" />
      </Head>
  )
}

export default HeadTournament