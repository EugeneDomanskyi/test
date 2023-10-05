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
      <ClaimImage warningIcon contentImg={{src: '/images/raffle/tkey-xl.png', width: 128, height: 128}}/>
        
      <ClaimText
        title="Approval required to manage TKeys"
        subTitle="The smart contract needs your approval to manage your TKeys"
      />

      <App.Button primary onClick={handleClickNextStep} sx={{width: 240, height: 56, fontSize: 16}}>
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