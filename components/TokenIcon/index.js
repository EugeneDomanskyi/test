import { useState } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'

const TokenIcon = ({ currency, small, fit, square }) => {
  const [visible, setVisible] = useState(false)

  const classes = () => {
    return cn(
      styles.icon,
      {[styles.small]: small},
      {[styles.fit]: fit},
      {[styles.square]: square},
      {[styles.visible]: visible},
    )
  }

  return (
    <div className={classes()}>
      <img src={`https://tegro-imagekit.s3.eu-central-1.amazonaws.com/TegroWeb/${currency.toUpperCase()}_256.png`} onLoad={() => setVisible(true)} onError={() => setVisible(false)} />
    </div>
  )
}

export default TokenIcon