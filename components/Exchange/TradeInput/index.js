import styles from './styles.module.scss'
import React, { useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

const TradeInput = ({label, currency, onChange, onBlur, error, warning, ...props}) => {

  const [focused, setFocused] = useState(false)

  const handleChange = ({target: {value}}) => {
    onChange(value)
  }

  const handleBlur = (e) => {
    setFocused(false)
    if (onBlur) {
      onBlur(e)
    }
  }

  return (
    <div className={cn(styles.container, {[styles.focused]: focused, [styles.error]: error, [styles.warning]: warning})}>
      <App.Flex column className={styles.labelContainer} align="flex-end" justify="center">
        <App.Text center color="#B9B8C5" size={10} weight={500}>{ label }</App.Text>
        <App.Text center color="#B9B8C5" size={10} weight={700}>{ currency }</App.Text>
      </App.Flex>
      <div className={styles.divider} />
      <input
        className={cn(styles.input, {[styles.error]: error, [styles.warning]: warning})}
        onChange={handleChange}
        onWheel={e => e.target.blur()}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        {...props} />
    </div>
  )
}

export default TradeInput
