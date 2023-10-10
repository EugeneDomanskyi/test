import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

const ErrorStep = ({campaign, onSubmit}) => {
  const dispatch = useDispatch()

  const handleClickNextStep = () => {
    dispatch($raffle.set.loading(true))
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