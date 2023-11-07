import Head from 'next/head'
import { useSelector } from 'react-redux'

const HeadExchange = ({route}) => {
  const current = useSelector(({ $token }) => $token.current)
  
  const getTitle = () => {
    if (current) {
      if (current?.price) {
        return `${current.price} ${current.symbol}/USDT | Trade ${current.name} at best price on Tegro: The CEX-DEX`
      }

      if (current?.symbol) {
        return `${current.symbol}/USDT | Trade ${current.name} at best price on Tegro: The CEX-DEX`
      }
    }

    return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
  }

  const getDescription = () => {
    if (current) {
      if (current?.symbol) {
        return `Buy, sell, and trade ${current.symbol ?? 'USDT'} or ${current.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${current.name} at the best prices.`
      }
    }

    return 'Buy, sell, and trade Tokens or NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens and NFTs at the best prices.'
  }

  return (
    <Head>
      <title>{getTitle()}</title>
      <meta name="description" content={getDescription()} />
    </Head>
  )
}

export default HeadExchange