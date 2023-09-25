import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleClaimModal/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleClaimModal/ClaimText'

import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

const SecondStep = ({item, onSubmit}) => {
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
        title={`Deposit ${item.tKeyRequired} Tkeys`}
        subTitle="You must deposit your TKeys to participate in the raffle."
      />

      <App.Button primary onClick={handleClickNextStep} sx={{width: 130}}>
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