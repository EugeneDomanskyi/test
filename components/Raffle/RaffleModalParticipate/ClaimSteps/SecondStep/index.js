import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

const SecondStep = ({campaign, onSubmit}) => {
  const dispatch = useDispatch()

  const { loading } = useSelector(({$raffle}) => $raffle)

  const handleClickNextStep = () => {
    dispatch($raffle.set.loading(true))
    onSubmit()
  }

  return (
    <>
      <ClaimImage contentImg={{src: "/images/raffle/tkey-xl.png", width: 128, height: 128}} />
      
      <ClaimText
        title={`Deposit ${campaign.tKeyRequired} Tkeys`}
        subTitle={`You need to deposit ${campaign.tKeyRequired} TKeys to open the case`}
      />

      <App.Button primary onClick={handleClickNextStep} disabled={loading} sx={{width: 240, height: 56, fontSize: 16}}>
        {
          loading
            ? <App.Loader size={20} />
            : "Confirm Deposit"
        }
      </App.Button>
    </>
  )
}

export default SecondStep