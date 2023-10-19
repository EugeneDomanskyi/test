import Head from 'next/head'

const HeadMarket = ({marketInfo}) => {
  return (
    <Head>
      <title>{`${marketInfo.name} Price, ${marketInfo.symbol ?? 'USDT'} Price Chart & Marketcap | Tegro: The CEX-DEX`}</title>
      <meta name="description" content={`Buy, sell, and trade ${marketInfo.symbol ?? 'USDT'} or ${marketInfo.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${marketInfo.name} at the best prices.`} />
      <meta name="keywords" content="keyword1, keyword2, keyword3" />
      <meta property="og:title" content={`${marketInfo.name} Price, ${marketInfo.symbol ?? 'USDT'} Price Chart & Marketcap | Tegro: The CEX-DEX`} />
      <meta property="og:description" content={`Buy, sell, and trade ${marketInfo.symbol ?? 'USDT'} or ${marketInfo.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${marketInfo.name} at the best prices.`} />
      {/* <meta property="og:image" content="https://example.com/image.jpg" /> */}
    </Head>
  )
}

export default HeadMarket