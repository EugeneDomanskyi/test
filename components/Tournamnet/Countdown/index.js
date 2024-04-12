import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const Countdown = ({endTime}) => {
  const duration = useCountdown(endTime)
  return (
      <App.Flex gap={12}>
        <App.Flex align={'flex-end'}>
          <App.Text weight={700} size={40} sx={{lineHeight: 1.1}}>{ duration.days }</App.Text>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24}>d</App.Text>
        </App.Flex>
        <App.Flex align={'flex-end'}>
          <App.Text weight={700} size={40} sx={{lineHeight: 1.1}}>{ duration.hours }</App.Text>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24}>h</App.Text>
        </App.Flex>
        <App.Flex align={'flex-end'}>
          <App.Text weight={700} size={40} sx={{lineHeight: 1.1}}>{ duration.minutes }</App.Text>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24}>m</App.Text>
        </App.Flex>
        <App.Flex align={'flex-end'}>
          <App.Text weight={700} size={40} sx={{lineHeight: 1.1}}>{ duration.seconds }</App.Text>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24}>s</App.Text>
        </App.Flex>
      </App.Flex>
  )
}

export default Countdown
