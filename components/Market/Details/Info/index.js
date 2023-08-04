import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import Chart from '@/components/Market/Details/Chart'

export default function Info() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={16}>
      <App.Flex justify="space-between">
        <App.Flex column gap={22}>
          <App.Flex gap={10}>
            <App.Flex className={styles.imageBlock}>
            
            </App.Flex>
            
            <App.Flex column gap={10} className={styles.nameBlock}>
              <div className={styles.nameTitle}>
                MetaSaga Warriors
              </div>
              <div className={styles.nameSubTitle}>
                WARRIORS
              </div>
              <div className={styles.nameSubTitle}>
                MS_WARR
              </div>
              {/* <App.Text size={28} weight={700}>
                MetaSaga Warriors
              </App.Text>
              <App.Text size={14} weight={500}>
                WARRIORS
              </App.Text>
              <App.Text size={14} weight={500}>
                MS_WARR
              </App.Text> */}
            </App.Flex>
          </App.Flex>

          <App.Flex gap={16} align="center" className={styles.nameBlock}>
            <App.Text size={28} weight={700}>
              $21,939.98
            </App.Text>
            <App.Text size={16} weight={500} color="#53F19C">
              <App.Icon icon="caret-up-fill" /> 2.33%
            </App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16}>
          <App.Flex column>
            <App.Text size={14} weight={500} color="#B9B8C5">
              Collection
            </App.Text>
            <App.Text size={16} weight={500}>
              MetaSaga
            </App.Text>
          </App.Flex>
          
          <App.Flex column>
            <App.Text size={14} weight={500} color="#B9B8C5">
              Project
            </App.Text>
            <App.Text size={16} weight={500}>
              MetaGaming Guild (MGG)
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <Chart />
    </App.Flex>
  )
}
