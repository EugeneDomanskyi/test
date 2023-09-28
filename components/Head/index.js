import { useRouter } from 'next/router'

import HeadDefault from './HeadDefault'
import HeadMarket from './HeadMarket'

const Head = ({ route, marketInfo, ...props }) => {
  const router = useRouter()

  const getHead = () => {
    const currentRoute = route || router.asPath

    if (currentRoute.includes('market')) {
      return <HeadMarket marketInfo={marketInfo} />
    }

    return <HeadDefault {...props} />
  }

  return getHead()
}

export default Head