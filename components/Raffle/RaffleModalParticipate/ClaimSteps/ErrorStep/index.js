import App from '@/components/App'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

import { trackEvent } from '@/libs/analytics.lib'

const errors = {
  'api' : {
    title: 'A server error has occurred',
    subTitle: 'Please try again later or contact our support.',
  },
  'balance' : {
    title: 'You don’t have enough TKeys to unlock this case',
    subTitle: 'Complete tasks on Galxe to collect TKeys',
  },
}

const ErrorStep = ({onSubmit, type}) => {
  const handleClickNextStep = () => {
    trackEvent('Click Get Tkeys', {
      'Source': 'Case Details',
    })

    if (type === 'balance') {
      window.open('https://galxe.com/tegro/campaign/GC9QPUMqMz?utm_source=web', '_blank')
    }
    onSubmit()
  }

  return (
    <>
      <ClaimImage dangerIcon contentImg={{src: '/images/raffle/tkey-xl.png', width: 128, height: 128}}/>
        
      <ClaimText
        title={errors[type].title}
        subTitle={errors[type].subTitle}
      />

      <App.Button primary onClick={handleClickNextStep} sx={{width: 240, height: 56, fontSize: 16}}>
        {
          type === 'balance'
            ? 'Collect TKeys'
            : 'Close'
        }
      </App.Button>
    </>
  )
}

export default ErrorStep