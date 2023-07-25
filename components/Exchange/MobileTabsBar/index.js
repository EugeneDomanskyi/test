import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const MobileTabsBar = ({active, actvieTrade, onTabChange}) => {
  const { wallet } = useWalletConnect()

  const tabs = [
    { key: 'markets', title: 'Markets', icon: 'exchange' },
    { key: 'charts', title: 'Charts', icon: 'chart' },
    { key: 'buy_sell', title: 'Buy/Sell', icon: 'arrows' },
    { key: 'trades', title: 'Trades', icon: 'trade' },
    { key: 'orders', title: 'Orders', icon: 'order' },
  ]

  const handleClickTab = (tab) => () => {
    if (tab.key === active || !wallet && tab.key === 'orders') {
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
        const isDisabled = !wallet && tab.key === 'orders'

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

export default MobileTabsBar