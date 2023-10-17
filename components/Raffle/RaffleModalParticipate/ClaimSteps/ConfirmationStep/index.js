import { useSelector } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

const ConfirmationStep = () => {
  return (
    <>
      <App.LoaderBlock size={140} color="#53F19C" />
        
      <ClaimText
        title="Waiting for blockchain confirmation"
        subTitle=""
      />
    </>
  )
}

export default ConfirmationStep