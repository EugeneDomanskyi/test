import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotAuctionsBadge = ({ status, win, isMega }) => {
  const colors = () => {
    switch (status) {
      case 'ongoing': return ['#5B18EA', '#3C168B']
      case 'upcoming': return ['#F59E0B', '#B45309']
      case 'closed': return win ? ['#06B357', '#0D6E3B'] : ['#fff', '#8B8B8B']
    }
  }
  
  return (
    <App.Flex center className={cn(styles.badge, {[styles.mega]: isMega})}>
      <svg className={styles.notMega} xmlns="http://www.w3.org/2000/svg" width={180} height={28} viewBox="0 0 135 21" fill="none">
        <path d="M8.52281 15.7574L0 0H135L126.477 15.7574C124.73 18.9874 121.353 21 117.681 21H17.3186C13.6465 21 10.2698 18.9874 8.52281 15.7574Z" fill={`url(#paint0_linear_5775_8_${status}_${win}_notmega)`} />
        <defs>
          <linearGradient id={`paint0_linear_5775_8_${status}_${win}_notmega`} x1="87.5" y1="0" x2="87.5" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor={colors()[0]} />
            <stop offset="1" stopColor={colors()[1]} />
          </linearGradient>
        </defs>
      </svg>

      <svg className={styles.isMega} xmlns="http://www.w3.org/2000/svg" width={180} height={28} viewBox="0 0 135 21" fill="none">
        <defs>
          <linearGradient id={`paint0_linear_5775_8_${status}_${win}_mega`} x1="87.5" y1="0" x2="87.5" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor={colors()[0]} />
            <stop offset="1" stopColor={colors()[1]} />
          </linearGradient>

          <clipPath id="clip-path">
            <path d="M8.52281 15.7574L0 0H135L126.477 15.7574C124.73 18.9874 121.353 21 117.681 21H17.3186C13.6465 21 10.2698 18.9874 8.52281 15.7574Z" />
          </clipPath>
        </defs>
        

        <path
          d="M8.52281 15.7574L0 0H135L126.477 15.7574C124.73 18.9874 121.353 21 117.681 21H17.3186C13.6465 21 10.2698 18.9874 8.52281 15.7574Z"
          fill={`url(#paint0_linear_5775_8_${status}_${win}_mega)`}
        />

        <path
          d="M8.52281 15.7574L0 0H135L126.477 15.7574C124.73 18.9874 121.353 21 117.681 21H17.3186C13.6465 21 10.2698 18.9874 8.52281 15.7574Z"
          fill="none"
          stroke="#FFBB01"
          strokeWidth="3"
          clipPath="url(#clip-path)"
        />
      </svg>

      <App.Text uppercase size={12} weight={400} sx={{letterSpacing: 1, position: 'absolute', zIndex: 1}}>{status == 'upcoming' ? 'coming soon' : status}</App.Text>
    </App.Flex>
  )
}

export default BotAuctionsBadge