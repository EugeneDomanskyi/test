import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'
import { useState} from "react";
import Radio from "@/components/Tournamnet/Radio";

const marks = [...new Array(21)].map((_, i) => {
  const isNum = !(i%5)
  return {
    value: i,
    label: isNum ? i : `•`,
  }
})

const HowWorks = ({tournament, onClose}) => {
  const [points, setPoints] = useState(8)
  const [activeTier, setActiveTier] = useState(tournament.tiers[0])
  const [bonusActive, setBonusActive] = useState(false)

  const bonusMultiplier = 0.25
  const [tier1, tier2, tier3] = tournament.tiers

  const total = points * activeTier.multiplier + (bonusActive ? points * bonusMultiplier : 0)

  const handleChangeRange = val => {
    setPoints(val)
  }

  return (
      <App.Flex column className={styles.container} gap={32}>
        <App.Flex className={styles.closeButton} onClick={onClose}>
          <App.Flex flex={1} align={'center'} justify={'center'} className={styles.closeIcon}>
            <App.Icon icon={'cross'} color={'#fff'} />
          </App.Flex>
        </App.Flex>
        <App.Flex gap={[64, 24]} align={'center'} className={styles.header}>
          <App.Text size={40} weight={800}>How it &nbsp;<App.Text inline size={40} color={'#7364FF'} family={'Playfair Display'}>Works</App.Text></App.Text>
          <App.Text size={12} weight={500} color={'rgba(255,255,255,0.6)'} lines={2} sx={{width: 400}}>Habitant porttitor morbi amet molestie euismod egestas. Massa nisl in eget tristique semper facilisi sit.</App.Text>
        </App.Flex>
        <App.Flex flex={1} gap={24} className={styles.content}>
          <App.Flex flex={1.2} column gap={30} className={styles.plate} sx={{padding: 32}}>
            <App.Flex>
              <App.Flex flex={1} column>
                <App.Text size={28} weight={700}>Complete</App.Text>
                <App.Text size={28} weight={700} family={'Playfair Display'}>Trades</App.Text>
                <App.Text color={'#A6DC37'} size={14} weight={400}>{ activeTier.multiplier } point per trade</App.Text>
              </App.Flex>
              <App.Flex flex={1} justify={'flex-end'}>
                <App.Flex column align={'center'} justify={'center'}>
                  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.1" d="M43.5421 15.8755C44.9399 12.7233 49.063 11.9503 51.5076 14.3821C53.4279 16.2922 56.531 16.2905 58.4492 14.3784C60.8913 11.944 65.0152 12.7126 66.4164 15.8633C67.5169 18.3381 70.4111 19.4575 72.8905 18.3674C76.0471 16.9796 79.6149 19.186 79.7833 22.6301C79.9155 25.3354 82.2099 27.4247 84.9157 27.3039C88.3604 27.1501 90.8902 30.4963 89.8031 33.7687C88.9491 36.339 90.3338 39.1161 92.9005 39.9809C96.1682 41.0818 97.3183 45.116 95.1225 47.7746C93.3978 49.8629 93.6857 52.9527 95.7667 54.6863C98.416 56.8933 98.0312 61.0705 95.0232 62.7564C92.6606 64.0806 91.8129 67.0657 93.1272 69.434C94.8003 72.4491 92.9325 76.2052 89.5186 76.6906C86.8371 77.0719 84.9684 79.5493 85.3383 82.2324C85.8093 85.6482 82.7108 88.476 79.3521 87.6954C76.7139 87.0823 74.0765 88.7173 73.4522 91.3529C72.6574 94.7082 68.7466 96.2257 65.8967 94.2845C63.6581 92.7598 60.6082 93.3316 59.074 95.5637C57.1208 98.4053 52.9259 98.4076 50.9697 95.568C49.4331 93.3376 46.3825 92.769 44.1456 94.2961C41.2978 96.2403 37.3853 94.727 36.587 91.3726C35.9599 88.7377 33.3207 87.1055 30.6831 87.7214C27.3253 88.5056 24.2237 85.6811 24.6911 82.2648C25.0581 79.5813 23.1868 77.106 20.5049 76.7275C17.0905 76.2457 15.2187 72.4916 16.8886 69.4748C18.2003 67.1051 17.3495 64.1209 14.9854 62.7992C11.9756 61.1165 11.5863 56.9397 14.2333 54.7298C16.3124 52.994 16.5971 49.904 14.8701 47.8175C12.6714 45.1612 13.8172 41.1258 17.0838 40.0214C19.6495 39.1538 21.0312 36.3753 20.1746 33.8059C19.0839 30.5347 21.6102 27.1857 25.0551 27.3359C27.761 27.4538 30.0531 25.362 30.1825 22.6566C30.3472 19.2124 33.9126 17.0021 37.0706 18.3865C39.5512 19.474 42.4442 18.3515 43.5421 15.8755Z" fill="#6B41EB"/>
                    <path d="M51.9767 24.519C53.4466 22.3829 56.6011 22.3829 58.071 24.519C59.2256 26.1969 61.5194 26.6256 63.2021 25.4782C65.3444 24.0173 68.2859 25.1568 68.8849 27.6797C69.3554 29.6613 71.3394 30.8897 73.323 30.4276C75.8484 29.8393 78.1796 31.9645 77.8268 34.5334C77.5497 36.5512 78.9559 38.4133 80.9725 38.699C83.5399 39.0626 84.9459 41.8864 83.689 44.1544C82.7017 45.9358 83.3403 48.1802 85.1175 49.1751C87.3801 50.4416 87.6712 53.5827 85.6798 55.2434C84.1156 56.5479 83.9003 58.8714 85.1982 60.4411C86.8504 62.4395 85.9872 65.4736 83.5304 66.3028C81.6006 66.9541 80.5605 69.043 81.2036 70.9755C82.0225 73.4358 80.1214 75.9531 77.531 75.8389C75.4962 75.7491 73.7718 77.3212 73.6734 79.3555C73.5482 81.9455 70.8661 83.6061 68.4919 82.5638C66.627 81.7451 64.451 82.588 63.6244 84.4495C62.572 86.8193 59.4713 87.3989 57.6339 85.5693C56.1906 84.1321 53.8571 84.1321 52.4139 85.5693C50.5765 87.3989 47.4757 86.8193 46.4233 84.4495C45.5967 82.588 43.4208 81.7451 41.5559 82.5638C39.1816 83.6061 36.4996 81.9455 36.3744 79.3555C36.276 77.3212 34.5515 75.7491 32.5168 75.8389C29.9263 75.9531 28.0253 73.4358 28.8441 70.9755C29.4873 69.043 28.4472 66.9541 26.5174 66.3028C24.0606 65.4736 23.1973 62.4395 24.8496 60.4411C26.1474 58.8714 25.9321 56.5479 24.368 55.2434C22.3766 53.5827 22.6677 50.4416 24.9303 49.1751C26.7075 48.1802 27.3461 45.9358 26.3588 44.1544C25.1018 41.8864 26.5079 39.0626 29.0753 38.699C31.0919 38.4133 32.4981 36.5512 32.221 34.5334C31.8682 31.9645 34.1994 29.8393 36.7247 30.4276C38.7084 30.8897 40.6923 29.6613 41.1629 27.6797C41.7619 25.1568 44.7033 24.0173 46.8456 25.4782C48.5284 26.6256 50.8221 26.1969 51.9767 24.519Z" fill="white"/>
                  </svg>
                  <App.Text sx={{position: 'absolute'}} size={30}>✅</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
            <App.Flex column flex={1}>
              <App.RangeInput
                  value={points}
                  max={20}
                  onChange={handleChangeRange}
                  step={1}
                  marks={marks}/>
            </App.Flex>
            <App.Flex justify={'space-between'} align={'center'} sx={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
              <App.Text size={14} weight={400} color={'rgba(255,255,255,0.6)'}>In total for trades:</App.Text>
              <App.Flex column align={'flex-end'}>
                <App.Text size={32} weight={700}>{points}</App.Text>
                <App.Text family={'Playfair Display'} size={16}>Points</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
          <App.Flex flex={2} column gap={16}>
            <App.Flex align={'center'} gap={8}>
              <App.Text size={20} weight={700}>Select</App.Text>
              <App.Text family={'Playfair Display'} size={20}>Multiplier</App.Text>
              <App.Text color={'#9B99AE'} size={14} weight={400}>(Based on Lifetime volume)</App.Text>
            </App.Flex>
            <App.Flex flex={1} gap={20} className={styles.tiers}>
              <App.Flex column flex={1} gap={20}>
                <App.Flex className={cn(styles.plate, {[styles.active]: activeTier.id === tier1.id})} flex={1} column>
                  <Radio
                      sx={{position: 'absolute', right: 16, top: 16}}
                      active={activeTier.id === tier1.id}
                      onChange={() => setActiveTier(tier1)}/>
                  <App.Text size={20} family={'Playfair Display'}>{tier1.title}</App.Text>
                  <App.Text color={'rgba(255,255,255,0.6)'} size={14} weight={600}>{tier1.description}</App.Text>
                  <App.Text size={32} weight={700}>x{tier1.multiplier}</App.Text>
                </App.Flex>
                <App.Flex className={cn(styles.plate, {[styles.active]: activeTier.id === tier2.id})} flex={1} column>
                  <Radio
                      sx={{position: 'absolute', right: 16, top: 16}}
                      active={activeTier.id === tier2.id}
                      onChange={() => setActiveTier(tier2)}/>
                  <App.Text size={20} family={'Playfair Display'}>{tier2.title}</App.Text>
                  <App.Text color={'rgba(255,255,255,0.6)'} size={14} weight={600}>{tier2.description}</App.Text>
                  <App.Text size={32} weight={700}>x{tier2.multiplier}</App.Text>
                </App.Flex>
              </App.Flex>
              <App.Flex flex={1} className={cn(styles.plate, styles.higher, {[styles.active]: activeTier.id === tier3.id})} column>
                <Radio
                    sx={{position: 'absolute', right: 16, top: 16}}
                    active={activeTier.id === tier3.id}
                    onChange={() => setActiveTier(tier3)}/>
                <App.Text size={20} family={'Playfair Display'}>{tier3.title}</App.Text>
                <App.Text color={'rgba(255,255,255,0.6)'} size={14} weight={600}>{tier3.description}</App.Text>
                <App.Text size={32} weight={700}>x{tier3.multiplier}</App.Text>
              </App.Flex>
              <App.Flex column className={cn(styles.plate, styles.bonus, {[styles.active]: bonusActive})}>
                <Radio
                    sx={{position: 'absolute', right: 16, top: 16}}
                    active={bonusActive}
                    onChange={val => setBonusActive(val)} />
                <App.Text size={20} family={'Playfair Display'}>White Tigers</App.Text>
                <App.Text color={'rgba(255,255,255,0.6)'} size={14} weight={600}>Early adopter NFT</App.Text>
                <App.Text size={32} weight={700}>{bonusMultiplier} <App.Text inline size={14} weight={700}>bonus</App.Text></App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
        <App.Flex className={styles.footer} justify={'space-between'} align={'center'}>
          <App.Text size={20} weight={700}>In total <App.Text color={'#A6DC37'} inline size={20} family={'Playfair Display'}>you get:</App.Text></App.Text>
          <App.Flex column align={'flex-end'}>
            <App.Text size={36} weight={700}>{total} <App.Text size={32} inline family={'Playfair Display'}>Points</App.Text></App.Text>
            <App.Text color={'#9B99AE'} size={14} weight={500}>(Multipliers: <App.Text size={14} inline family={'Playfair Display'}>{activeTier.title}</App.Text>)</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
  )
}

export default HowWorks
