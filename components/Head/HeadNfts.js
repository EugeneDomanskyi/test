import Head from 'next/head'
import { useSelector } from 'react-redux'

const HeadNfts = ({ currentInfo }) => {
  const current = useSelector(({ $collection }) => $collection.current)
  const initCurrent = currentInfo?.id ? currentInfo : current

  const getTitle = () => {
    if (initCurrent?.id) {
      let ticker = ''
      if (initCurrent?.ticker?.value) {
        ticker = `${initCurrent.ticker.type == 'plus' ? '▲' : '▼'} ${initCurrent.ticker.value}%`
      }
      return `${initCurrent.price} ${initCurrent.name} ${ticker} | Trade ${initCurrent.name} at best price on Tegro: The CEX-DEX`
    }

    return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
  }

  const getDescription = () => {
    if (initCurrent?.id) {
      return `Buy, sell, and trade ${initCurrent.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${initCurrent.name} at the best prices.`
    }

    return 'Buy, sell, and trade NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade NFTs at the best prices.'
  }

  const getUrl = () => {
    return `https://tegro.com/nfts/${initCurrent.blockchain}/${initCurrent.address}`
  }

  return (
    <Head>
      <title>{getTitle()}</title>
      <meta name="description" content={getDescription()} />

      <meta property="og:url" content={getUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={getTitle()} />
      <meta property="og:description" content={getDescription()} />
      <meta property="og:image" content="" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="tegro.com" />
      <meta property="twitter:url" content={getUrl()} />
      <meta name="twitter:title" content={getTitle()} />
      <meta name="twitter:description" content={getDescription()} />
      <meta name="twitter:image" content="" />
    </Head>
  )
}

export default HeadNfts