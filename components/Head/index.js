import { useRouter } from 'next/router'

import HeadDefault from './HeadDefault'
import HeadExchange from './HeadExchange'
import HeadTournament from "./HeadTournament";

const Head = ({ route }) => {
  const router = useRouter()

  const getHead = () => {
    const currentRoute = route || router.asPath

    if (currentRoute.includes('exchange')) {
      return <HeadExchange />
    }

    if (currentRoute.includes('tournament')) {
      return <HeadTournament />
    }

    return <HeadDefault />
  }

  return getHead()
}

export default Head