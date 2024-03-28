import App from '@/components/App'


import styles from './styles.module.scss'
import Tiers from "@/components/Tournament/Tiers";
import TierInfo from "@/components/Tournament/TierInfo";
import TierStats from "@/components/Tournament/TierStats";
import useWalletConnect from "@/myhooks/wallet-connect";

const TierBlock = ({tiers, walletResults, onClickWorks}) => {
  const { wallet } = useWalletConnect()
  return (
      <App.Container>
        <App.Flex className={styles.tierBlock} gap={24}>
          <App.Flex className={styles.tierInfo} flex={1} column gap={26}>
            { wallet ? <Tiers tiers={tiers} current={walletResults.tier?.level} /> : null }
            <TierInfo walletResults={walletResults} />
          </App.Flex>
          <TierStats walletResults={walletResults} onClickWorks={onClickWorks} />
        </App.Flex>
      </App.Container>
  )
}

export default TierBlock
