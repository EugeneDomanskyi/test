import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import dynamic from 'next/dynamic'

import App from '@/components/App'
import DifferenceIndicator from '@/components/Market/DifferenceIndicator'
const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

export default function Info({type, marketInfo}) {
  // const { marketInfo } = useSelector(({$app}) => $app)

  return (
    <App.Flex column sx={{width: '100%'}} gap={16}>
      <App.Flex className={styles.container}>
        <App.Flex column gap={22}>
          <App.Flex className={styles.infoContainer} gap={10}>
            <App.Flex className={styles.imageBlock}>
              <img src={marketInfo?.image} alt="" />
            </App.Flex>
            
            <App.Flex column gap={10} className={styles.nameBlock}>
              <div className={styles.nameTitle}>
                { marketInfo?.name }
              </div>

              <div className={styles.nameSubTitle}>
                { marketInfo?.symbol || marketInfo?.currency }
              </div>

              <div className={styles.nameSubTitle}>
                { marketInfo?.project_name?.toUpperCase() }
              </div>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.additionalInfoContainer} gap={16}>
          {
            marketInfo?.parent_collection_name
              ? <App.Flex column>
                  <App.Text size={14} weight={500} color="#B9B8C5">
                    Collection
                  </App.Text>
      
                  <App.Text size={16} weight={500}>
                    { marketInfo?.parent_collection_name }
                  </App.Text>
                </App.Flex>
              : null
          }          
          
          {
            marketInfo?.project_name
              ? <App.Flex column>
                  <App.Text size={14} weight={500} color="#B9B8C5">
                    Project
                  </App.Text>
      
                  <App.Text size={16} weight={500}>
                    { marketInfo?.project_name }
                  </App.Text>
                </App.Flex>
              : null
          }
        </App.Flex>
      </App.Flex>

      {
         marketInfo?.price
          ? <App.Flex gap={16} align="center">
              <App.Text size={28} weight={700}>
                ${ marketInfo?.price }
              </App.Text>

              {
                marketInfo?.ticker
                  ? <DifferenceIndicator ticker={marketInfo?.ticker} />
                  : null
              }
            </App.Flex>
          : null
      }

      <App.Flex sx={{height: 443}}>
        <Chart type={type} />
      </App.Flex>
    </App.Flex>
  )
}
