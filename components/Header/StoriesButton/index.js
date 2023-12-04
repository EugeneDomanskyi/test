import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import App from '@/components/App'

import styles from './styles.module.scss'

const StoriesButton = () => {
  const balance = useSelector(({$raffle}) => $raffle.balance)


  return (
    <App.Flex column className={cn(styles.container, {[styles.sticky]: isSticky})}>
      
    </App.Flex>
  )
}

export default StoriesButton