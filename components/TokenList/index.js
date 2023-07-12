import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useRouter } from 'next/router'

import App from '@/components/App'

const TokenList = () => {
  const router = useRouter()

  const tokens = useSelector(({$app}) => $app.tokens)
  console.log(router.query.tokenId)
  
  return (
    <App.Flex column className={styles.container}>
      {
        tokens.map((token) => {
          const isActive = router.query.tokenId === token.code
          return (
            <App.Flex gap={16} align="center" key={token.code}>
              <Image src={token.image} width={48} height={48} alt="" />
              <App.Flex column>
                <App.Text weight={700}>{token.collection}</App.Text>
                <App.Text size={12} weight={400} color="#B9B8C5">{token.game}</App.Text>
                <App.Text size={12} weight={400} color="#B9B8C5">{token.code}</App.Text>
              </App.Flex>
            </App.Flex>
          )
        })
      }
    </App.Flex>
  )
}

export default TokenList
