import Head from 'next/head'
import { useSelector } from 'react-redux'

const HeadExchange = ({ ssCurrent }) => {
  const current = useSelector(({ $token }) => $token.current)
  const initCurrent = ssCurrent ?? current

  const getTitle = () => {
    if (initCurrent?.id) {
      // let ticker = ''
      // if (initCurrent?.ticker?.value && initCurrent.ticker.value * 1 != 0) {
      //   ticker = `${initCurrent.ticker.type == 'plus' ? '▲' : '▼'} ${initCurrent.ticker.value}%`
      // }
      return (`$${initCurrent.price} ${initCurrent.symbol}/${initCurrent.quoteSymbol} | `) + `Tegro Gen2 DEX`
    }

    return 'Tegro Gen2 DEX'
  }

  const getDescription = () => {
    if (initCurrent?.id) {
      return `Trade ${initCurrent.symbol}/${initCurrent.quoteSymbol} on Tegro Gen2 DEX. Buy and sell top cryptocurrencies on Base at the best prices without gas fees or slippage, only on Tegro!`
    }

    return 'Buy, sell, and trade Tokens instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens at the best prices.'
  }

  const getUrl = () => {
    if (initCurrent?.id) {
      return `https://tegro.com/exchange/${initCurrent.blockchain}/${initCurrent.address}`
    }

    return 'https://tegro.com/exchange'
  }

  const getImage = () => {
    if (initCurrent?.id) {
      return `https://tegro.com/images/og/OG-${initCurrent.symbol}.png`
    }

    return 'https://tegro-imagekit-tora.s3.eu-central-1.amazonaws.com/images/exchange-og.png'
  }

  return (
    <Head>
      <title>{getTitle()}</title>
      <meta name="description" content={getDescription()} />

      <meta property="og:url" content={getUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={getTitle()} />
      <meta property="og:description" content={getDescription()} />
      <meta property="og:image" content={getImage()} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="tegro.com" />
      <meta property="twitter:url" content={getUrl()} />
      <meta name="twitter:title" content={getTitle()} />
      <meta name="twitter:description" content={getDescription()} />
      <meta name="twitter:image" content={getImage()} />
    </Head>
  )
}

export default HeadExchange