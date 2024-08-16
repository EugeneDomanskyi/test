import { useRouter } from 'next/router'

import HeadDefault from './HeadDefault'
import HeadExchange from './HeadExchange'
import HeadPD from './HeadPD'
import HeadTournaments from './HeadTournaments'
import HeadAuctions from './HeadAuctions'

const Head = ({ route, current, share }) => {
  const router = useRouter()

  const getHead = () => {
    const currentRoute = route || router.asPath

    if (currentRoute.includes('exchange')) {
      return <HeadExchange ssCurrent={current} />
    }

    if (currentRoute.includes('auctions')) {
      return <HeadAuctions ssShare={share} />
    }

    if (currentRoute.includes('gems-dashboard')) {
      return <HeadPD />
    }

    if (currentRoute.includes('tournaments')) {
      return <HeadTournaments />
    }

    return <HeadDefault />
  }

  return getHead()
}

export default Head