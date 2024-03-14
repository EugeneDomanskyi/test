import {useRef, useEffect} from 'react'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsProgressCircle = ({ size = 200, trackWidth = 24, progress = 72 }) => {
  const { t } = useTranslation()

  const center = size / 2
  const radius = (size - trackWidth) / 2
  const dashArray = 2 * Math.PI * radius
  const dashOffset = dashArray * ((100 - progress) / 100)
  const trackRef = useRef(null)

  useEffect(() => {
    if (progress) {
      trackRef.current.animate(
        [{strokeDashoffset: dashArray},{strokeDashoffset: dashOffset}],
        {duration: 1000, easing: 'ease-in-out'}
      )
    }
  }, [progress])

  return (
    <App.Flex center width={size} height={size} className={styles.container}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx={center} cy={center} r={radius} stroke="#12101977" fill="transparent" strokeDasharray={dashArray} strokeWidth={trackWidth} />
        <circle cx={center} cy={center} r={radius} stroke="url(#circleGradient)" fill="transparent" strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth={trackWidth} ref={trackRef} />
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#BBFE2B', stopOpacity: 1}}/>
          <stop offset="100%" style={{stopColor: '#563AFF', stopOpacity: 1}}/>
        </linearGradient>
      </svg>

      <App.Flex column center className={styles.info}>
        <App.Text family={'Playfair Display'} size={48} center>{progress}</App.Text>
        <App.Flex center width={100}>
          <App.Text center size={14} color="#9B99AE">{t('Successful Referrals')}</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsProgressCircle
