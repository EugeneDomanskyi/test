import Head from 'next/head'

const HeadDefault = () => {
  const getTitle = () => {
    return 'Tegro Gen2 DEX'
  }

  const getDescription = () => {
    return 'Tegro Gen2 DEX is revolutionizing on-chain trading with unmatched gas efficiency and market tools!'
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
      <meta property="og:image" content="https://tegro-imagekit-tora.s3.eu-central-1.amazonaws.com/images/exchange-og.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="tegro.com" />
      <meta property="twitter:url" content={getUrl()} />
      <meta name="twitter:title" content={getTitle()} />
      <meta name="twitter:description" content={getDescription()} />
      <meta name="twitter:image" content="https://tegro-imagekit-tora.s3.eu-central-1.amazonaws.com/images/exchange-og.png" />
    </Head>
  )
}

export default HeadDefault