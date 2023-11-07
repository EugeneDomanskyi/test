import { useRouter } from 'next/router'

import HeadDefault from './HeadDefault'
import HeadMarket from './HeadMarket'
import HeadExchange from './HeadExchange'
import HeadNfts from './HeadNfts'

const Head = ({ route, ...props }) => {
  const router = useRouter()

  const getHead = () => {
    const currentRoute = route || router.asPath

    if (currentRoute.includes('market')) {
      return <HeadMarket route={currentRoute} />
    }

    if (currentRoute.includes('exchange')) {
      return <HeadExchange {...props} />
    }

    if (currentRoute.includes('nfts')) {
      return <HeadNfts {...props} />
    }

    return <HeadDefault {...props} />
  }

  return getHead()
}

export default Head