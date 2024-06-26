import { useRouter } from 'next/router'

import HeadDefault from './HeadDefault'
import HeadExchange from './HeadExchange'
import HeadPD from './HeadPD'
import HeadTournaments from './HeadTournaments'

const Head = ({ route }) => {
  const router = useRouter()

  const getHead = () => {
    const currentRoute = route || router.asPath

    if (currentRoute.includes('exchange')) {
      return <HeadExchange />
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