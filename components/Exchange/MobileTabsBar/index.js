import { memo } from 'react'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const tabs = [
  { key: 'markets', title: 'Markets', icon: 'exchange' },
  { key: 'charts', title: 'Charts', icon: 'chart' },
  { key: 'buy_sell', title: 'Buy/Sell', icon: 'arrows' },
  { key: 'trades', title: 'Trades', icon: 'trade' },
  { key: 'orders', title: 'Orders', icon: 'order' },
]

const MobileTabsBar = ({active, actvieTrade, isConnected, onTabChange}) => {

  const handleClickTab = (tab) => () => {
    if (tab.key === active || !isConnected && tab.key === 'orders') {
      return
    }
    
    if (onTabChange) {
      onTabChange(tab.key)
    }
  }

  return (
    <App.Flex row align="center" className={styles.tabBarContainer}>
      {tabs.map((tab, i) => {
        const isActive = tab.key === active
        const isDisabled = !isConnected && tab.key === 'orders'

        return (
          <App.Flex key={tab.key} column justify="flex-end" align="center" flex={1} height="100%" className={cn(styles.tabItem, {[styles.disabled]: isDisabled})} onClick={handleClickTab(tab)}>
            {tab.key === 'buy_sell' ? (
              <App.Flex center className={cn(styles.buySellTabIcon, {[styles.active]: actvieTrade})}>
                <App.Icon icon={actvieTrade ? 'cross' : 'arrows'} />
              </App.Flex>
            ) : (
              <App.Icon icon={tab.icon} color={isActive ? '#E9CB2D' : '#BFBAD3'} />
            )}
            <App.Text size={12} color={ isActive ? '#E9CB2D' : '#BFBAD3'}>{ tab.title }</App.Text>
          </App.Flex>
        )
      })}
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.isConnected === next.isConnected && prev.active === next.active && prev.actvieTrade === next.actvieTrade && prev.onTabChange === next.onTabChange
}

export default memo(MobileTabsBar, isEqual)