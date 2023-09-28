import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

const FirstStep = ({item, onSubmit}) => {
  const dispatch = useDispatch()

  const { loading } = useSelector(({$raffle}) => $raffle)

  const handleClickNextStep = () => {
    dispatch($raffle.set.loading(true))
    onSubmit()
  }

  return (
    <>
      <ClaimImage warningIcon contentImg={{src: '/images/raffle/usdt.png', width: 64, height: 65}}/>
        
      <ClaimText
        title="Grant factory contract approval"
        subTitle="You must grant approval to the factory contract to manage your TKeys."
      />

      <App.Button primary onClick={handleClickNextStep} sx={{width: 140}}>
        {
          loading
            ? <App.Loader size={20} />
            : "Confirm Approval"
        }
      </App.Button>
    </>
  )
}

export default FirstStep