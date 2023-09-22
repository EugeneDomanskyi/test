import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleClaimModal/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleClaimModal/ClaimText'

const SecondStep = ({item, onSubmit}) => {
  const handleClickNextStep = () => {
    onSubmit()
  }

  return (
    <>
      <ClaimImage contentImg={{src: "/images/raffle/tkey-xl.png", width: 128, height: 128}} />
      
      <ClaimText
        title={`Deposit ${item.tKeyRequired} Tkeys`}
        subTitle="You must deposit your TKeys to participate in the raffle."
      />

      <App.Button primary onClick={handleClickNextStep}>
        Confirm Deposit
      </App.Button>
    </>
  )
}

export default SecondStep