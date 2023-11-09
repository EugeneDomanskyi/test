import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import Image from 'next/image'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Investors({marketInfo}) {
  return (
    <App.Flex column sx={{width: '100%'}}>
      <SectionTitle>Investors</SectionTitle>

      <App.Flex className={styles.container}>
        {
          marketInfo.investors.map((item, index) => {
            return (
              <App.Flex key={index}>
                <Image src={item.image} width={110} height={30} alt="Investor" />
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}
