import { useRouter } from 'next/router'

import HeadDefault from './HeadDefault'
import HeadExchange from './HeadExchange'

const Head = ({ route, ...props }) => {
  const router = useRouter()

  const getHead = () => {
    const currentRoute = route || router.asPath

    if (currentRoute.includes('exchange')) {
      return <HeadExchange {...props} />
    }

    return <HeadDefault {...props} />
  }

  return getHead()
}

export default Head