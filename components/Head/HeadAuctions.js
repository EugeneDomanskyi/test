import Head from 'next/head'

const HeadAuctions = ({ ssShare }) => {
  const getTitle = () => {
    return 'Get Base Memecoins & ETH at 95% OFF - Tegro Auctions | Bid Daily'
  }

  const getDescription = () => {
    return 'Join Tegro Auctions to grab your favorite Base memecoins and ETH at unbeatable discounts of up to 95% OFF. Use gems to place bids daily and win bags of your favorite tokens. Don’t miss out – start bidding now!'
  }

  const getUrl = () => {
    return `https://tegro.com/auctions`
  }

  const getImage = () => {
    return ssShare ? `https://storage.googleapis.com/auctions_shares/${ssShare}.png` : 'https://tegro.com/images/auctions-opengraph.jpg'
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
        <meta property="og:image" content={getImage()} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="tegro.com" />
        <meta property="twitter:url" content={getUrl()} />
        <meta name="twitter:domain" content="tegro.com" />
        <meta name="twitter:url" content={getUrl()} />
        <meta name="twitter:title" content={getTitle()} />
        <meta name="twitter:description" content={getDescription()} />
        <meta name="twitter:image" content={getImage()} />
      </Head>
  )
}

export default HeadAuctions