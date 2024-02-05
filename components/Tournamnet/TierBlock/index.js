import App from '@/components/App'


import styles from './styles.module.scss'
import Tiers from "@/components/Tournamnet/Tiers";
import TierInfo from "@/components/Tournamnet/TierInfo";
import TierStats from "@/components/Tournamnet/TierStats";

const TierBlock = ({tiers, walletResults, onClickWorks}) => {
  return (
      <App.Container>
        <App.Flex className={styles.tierBlock} gap={24}>
          <App.Flex className={styles.tierInfo} flex={1} column gap={26}>
            <Tiers tiers={tiers} current={walletResults.tier?.level} />
            <TierInfo walletResults={walletResults} />
          </App.Flex>
          <TierStats walletResults={walletResults} onClickWorks={onClickWorks} />
        </App.Flex>
      </App.Container>
  )
}

export default TierBlock
