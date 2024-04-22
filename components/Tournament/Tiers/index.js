import App from '@/components/App'
import cn from 'classnames'

import styles from './styles.module.scss'

const Tiers = ({tiers, current}) => {
  return (
      <App.Flex justify={'space-between'} gap={16} className={styles.container}>
        {
          tiers?.map((tier, i) => {
            const isActive = current >= tier.level
            const isCurrent = current === tier.level
            return (
                <App.Flex flex={1} key={tier.id} className={cn(styles.tier, {[styles.active]: isActive, [styles.current]: isCurrent})}>
                  <App.Flex align={'center'} justify={'center'} flex={1} className={styles.inner}>
                    <App.Text size={16} family={isActive ? 'Playfair Display' : 'Gilroy'} color={isActive ? '#A6DC37' : '#9B99AE'}>{ tier.title }</App.Text>
                  </App.Flex>
                </App.Flex>
            )
          })
        }
      </App.Flex>
  )
}

export default Tiers
