import styles from './styles.module.scss'
import React, { useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

const TradeInput = ({label, currency, onChange, onBlur, error, ...props}) => {

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
    <div className={cn(styles.container, {[styles.focused]: focused, [styles.error]: error})}>
      <App.Flex column className={styles.labelContainer} align="flex-end" justify="center">
        <App.Text center color="#B9B8C5" size={10} weight={500}>{ label }</App.Text>
        <App.Text center color="#B9B8C5" size={10} weight={700}>{ currency }</App.Text>
      </App.Flex>
      <div className={styles.divider} />
      <input
        className={styles.input}
        onChange={handleChange}
        onWheel={e => e.target.blur()}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        // type="number"
        {...props} />
    </div>
  )
}

export default TradeInput
