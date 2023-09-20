import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleClaimModal/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleClaimModal/ClaimText'

const FirstStep = ({item, onSubmit}) => {
  const handleClickNextStep = () => {
    onSubmit()
  }

  return (
    <>
      <ClaimImage warningIcon contentImg={{src: '/images/raffle/usdt.png', width: 64, height: 65}}/>
        
      <ClaimText
        title="Grant factory contract approval"
        subTitle="You must grant approval to the factory contract to manage your TKeys."
      />

      <App.Button primary onClick={handleClickNextStep}>
        Confirm Approval
      </App.Button>
    </>
  )
}

export default FirstStep