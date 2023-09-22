import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'

import App from '@/components/App'
const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})
// import Chart from '@/components/Market/Details/Chart'

export default function Info() {
  const { current, marketInfo } = useSelector(({$collection}) => $collection)

  return (
    <App.Flex column sx={{width: '100%'}} gap={16}>
      <App.Flex className={styles.container}>
        <App.Flex column gap={22}>
          <App.Flex className={styles.infoContainer} gap={10}>
            <App.Flex className={styles.imageBlock}>
              <img src={current.image} alt="" />
            </App.Flex>
            
            <App.Flex column gap={10} className={styles.nameBlock}>
              <div className={styles.nameTitle}>
                { marketInfo.name }
              </div>
              <div className={styles.nameSubTitle}>
                { marketInfo?.project_name?.toUpperCase() }
              </div>
              <div className={styles.nameSubTitle}>
                { marketInfo?.symbol || marketInfo.currency }
              </div>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.additionalInfoContainer} gap={16}>
          <App.Flex column>
            <App.Text size={14} weight={500} color="#B9B8C5">
              Collection
            </App.Text>
            <App.Text size={16} weight={500}>
              { marketInfo?.parent_collection_name }
            </App.Text>
          </App.Flex>
          
          <App.Flex column>
            <App.Text size={14} weight={500} color="#B9B8C5">
              Project
            </App.Text>
            <App.Text size={16} weight={500}>
              { marketInfo?.project_name }
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex gap={16} align="center">
        <App.Text size={28} weight={700}>
          ${ current.marketCap }
        </App.Text>
        <App.Text size={16} weight={500} color="#53F19C">
          <App.Icon icon="caret-up-fill" /> 2.33%
        </App.Text>
      </App.Flex>

      <App.Flex sx={{height: 443}}>
        <Chart type="nfts" />
      </App.Flex>
    </App.Flex>
  )
}
