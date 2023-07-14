import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cn from 'classnames'

import App from '@/components/App'

const TokenList = () => {
  const router = useRouter()
  const [tokenId] = router.query.tokenId || []

  const collections = useSelector(({$exchange}) => $exchange.collections)
  
  return (
    <App.Flex column className={styles.container}>
      {
        collections.filter(collection => collection.image).map((collection) => {
          const isActive = tokenId === collection.id
          return (
            <Link href={`/exchange/${collection.id}`} key={collection.id}>
              <App.Flex gap={16} align="center" className={cn(styles.token, {[styles.active]: isActive})}>
                <Image src={collection.image} width={48} height={48} alt="" />
                <App.Flex column>
                  <App.Text weight={700}>{collection.name}</App.Text>
                  {/* <App.Text size={12} weight={400} color="#B9B8C5">{token.game}</App.Text> */}
                  {/* <App.Text size={12} weight={400} color="#B9B8C5">{token.code}</App.Text> */}
                </App.Flex>
              </App.Flex>
            </Link>
          )
        })
      }
    </App.Flex>
  )
}

export default TokenList
