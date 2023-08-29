import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Images() {
  const { current, currentMarketSeoInfo } = useSelector(({$collection}) => $collection)

  const market = currentMarketSeoInfo?.token_metadata?.length ? currentMarketSeoInfo?.token_metadata[0] : null

  return (
    <App.Flex sx={{width: '100%'}} className={styles.container}>
      {
        market && Object.values(market.nft_gallery).map(image => {
          return (
            <App.Flex className={styles.imageBlock}>
              <img src={image} alt="" />
            </App.Flex>
          )
        })
      }
    </App.Flex>
  )
}
