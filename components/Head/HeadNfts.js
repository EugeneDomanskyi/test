import Head from 'next/head'
import { useSelector } from 'react-redux'

const HeadNfts = ({route}) => {
  const current = useSelector(({ $collection }) => $collection.current)
  
  const getTitle = () => {
    if (current) {
      if (current?.price) {
        return `${current.price} ${current.name} | Trade ${current.name} at best price on Tegro: The CEX-DEX`
      }

      if (current?.name) {
        return `${current.name} | Trade ${current.name} at best price on Tegro: The CEX-DEX`
      }
    }

    return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
  }

  const getDescription = () => {
    if (current) {
      if (current?.name) {
        return `Buy, sell, and trade ${current.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${current.name} at the best prices.`
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

export default HeadNfts