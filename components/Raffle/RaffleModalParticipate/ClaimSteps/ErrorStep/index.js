import { useSelector } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

import { trackEvent } from '@/libs/analytics.lib'

const ErrorStep = ({onSubmit}) => {
  const { wallet } = useWalletConnect()

  const tokenIds = useSelector(({ $raffle }) => $raffle.tokenIds)

  const handleClickNextStep = () => {
    trackEvent('Click Collect TKeys', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Tkeys Quantity': tokenIds.length,
      'WalletAddress': wallet,
    })
    window.open('https://galxe.com/tegro', '_blank')
    onSubmit()
  }

  return (
    <>
      <ClaimImage dangerIcon contentImg={{src: '/images/raffle/tkey-xl.png', width: 128, height: 128}}/>
        
      <ClaimText
        title="You don’t have enough TKeys to unlock this case"
        subTitle="Complete tasks on Galxe to collect TKeys"
      />

      <App.Button primary onClick={handleClickNextStep} sx={{width: 240, height: 56, fontSize: 16}}>
        Collect TKeys
      </App.Button>
    </>
  )
}

export default ErrorStep