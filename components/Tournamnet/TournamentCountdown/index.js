import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const TournamentCountdown = ({endTime}) => {
  const duration = useCountdown(endTime)
  return (
      <App.Flex align="center" gap={8}>
        <App.Flex align={'flex-end'}>
          <App.Flex width={48}>
            <App.Text weight={600} size={40} height={1}>{ duration.days }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24} height={1.2}>d</App.Text>
        </App.Flex>

        <App.Text weight={300} size={24} color="#9B99AE" height={1}>:</App.Text>

        <App.Flex align={'flex-end'}>
          <App.Flex width={48}>
            <App.Text weight={600} size={40} height={1}>{ duration.hours }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24} height={1.2}>h</App.Text>
        </App.Flex>

        <App.Text weight={300} size={24} color="#9B99AE" height={1}>:</App.Text>

        <App.Flex align={'flex-end'}>
          <App.Flex width={48}>
            <App.Text weight={600} size={40} height={1}>{ duration.minutes }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24} height={1.2}>m</App.Text>
        </App.Flex>

        <App.Text weight={300} size={24} color="#9B99AE" height={1}>:</App.Text>

        <App.Flex align={'flex-end'}>
          <App.Flex width={48}>
            <App.Text weight={600} size={40} height={1}>{ duration.seconds }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24} height={1.2}>s</App.Text>
        </App.Flex>
      </App.Flex>
  )
}

export default TournamentCountdown
