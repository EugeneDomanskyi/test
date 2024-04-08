import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

const Radio = ({active, onChange, sx = {}}) => {
  return (
      <App.Flex className={styles.container} style={sx} onClick={() => onChange(!active)}>
        <App.Flex className={cn(styles.state, {[styles.active]: active})} />
      </App.Flex>
  )
}

export default Radio
