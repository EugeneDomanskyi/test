import { usePropsHelper } from '@/myhooks/props-helper'
import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

export default function DifferenceIndicator({ticker}) {
  const { isMobile } = usePropsHelper()

  return (
    <App.Text size={16} weight={500} className={cn(styles.indicator, {[styles.negative]: ticker.type === 'minus'})}>
      <App.Icon icon="caret-up-fill" /> {ticker.value}%
    </App.Text>
  )
}