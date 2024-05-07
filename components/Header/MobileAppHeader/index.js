import cn from 'classnames'
import App from '@/components/App'
import SwitchBlockchain from '@/components/Header/SwitchBlockchain'
import HeaderWallet from '@/components/Header/HeaderWallet'

import styles from './styles.module.scss'

const Header = () => {
  return (
    <App.Flex column className={cn(styles.container)}>
      <App.Flex row full align="center" gap={[0, 16]}>
        {/* <App.Flex row full gap={24} align="center" justify={['flex-start', 'space-between']}>
          <App.Flex row fullHeight gap={[24, 8]} align="center">
            
          </App.Flex>
        </App.Flex> */}
        <div className={styles.logo}>
          <App.Icon icon="logo-tiger-head" width={36} height={36} />
        </div>

        <App.Flex row fullHeight fullWidth gap={8} align="center" justify="space-between">
          <SwitchBlockchain />
          <HeaderWallet />
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default Header