import styles from './styles.module.scss'
import App from '@/components/App'
import Image from 'next/image'

const Leaderboard = ({leaderboard}) => {
  return (
      <App.Container>
        <App.Flex>
          <App.Flex column flex={1} gap={16}>
            <App.Flex column>
              <App.Text weight={800} size={64} sx={{lineHeight: 1}}>Tournament</App.Text>
              <App.Text family={'Playfair Display'} size={64} color={'#A6DC37'}>Leaders</App.Text>
            </App.Flex>
            <App.Text size={12} weight={400} color={'#9B99AE'}>Rutrum faucibus donec quisque nisi eget adipiscing vel nullam metus. Semper in elementum curabitur nibh urna. Ut ut nec ultricies ac eget euismod at. Nec faucibus in sagittis ultricies imperdiet. Vivamus in euismod egestas pellentesque semper quisque ut risus. Donec a mattis condimentum etiam proin. Aliquam porttitor et id amet suspendisse sapien interdum. Sed.</App.Text>
            <App.Text color={'#A6DC37'} size={14} weight={600}>{`How It Works? >`}</App.Text>
          </App.Flex>
          <App.Flex flex={1}>
            <Image src={'/images/tournament/leaderboard.png'} width={614} height={278} />
          </App.Flex>
        </App.Flex>
        <App.Flex className={styles.row} align={'center'}>
          <App.Flex justify={'center'} width={50}>
            <App.Text color={'#7364FF'} size={14} weight={600}>№</App.Text>
          </App.Flex>
          <App.Flex flex={1} sx={{paddingLeft: 30}}>
            <App.Text color={'#7364FF'} size={14} weight={600}>Wallet Address</App.Text>
          </App.Flex>
          <App.Flex flex={1} justify={'center'}>
            <App.Text color={'#7364FF'} size={14} weight={600}>Earned</App.Text>
          </App.Flex>
          <App.Flex justify={'flex-end'} width={120}>
            <App.Text color={'#7364FF'} size={14} weight={600}>Reward</App.Text>
          </App.Flex>
        </App.Flex>
        {
          leaderboard.map((item) => {
            return (
                <App.Flex key={item.wallet_address} className={styles.row} align={'center'}>
                  <App.Flex justify={'center'} width={50}>
                    <App.Text color={'#7364FF'} size={14} weight={600}>{item.position}</App.Text>
                  </App.Flex>
                  <App.Flex flex={1} sx={{paddingLeft: 30}}>
                    <App.Text size={16} family={'Playfair Display'}>{item.wallet_address}</App.Text>
                  </App.Flex>
                  <App.Flex flex={1} justify={'center'}>
                    <App.Text color={'#9B99AE'} size={14} weight={600}>Earned: </App.Text>
                    &nbsp;
                    <App.Text size={14} family={'Playfair Display'} sx={{lineHeight: 1.2}}>{item.points}</App.Text>
                  </App.Flex>
                  <App.Flex justify={'flex-end'} width={120}>
                    <App.Text color={'#9B99AE'} size={14} weight={600}>Reward: </App.Text>
                    &nbsp;
                    <App.Text size={14} family={'Playfair Display'} sx={{lineHeight: 1.2}}>{item.reward}</App.Text>
                  </App.Flex>
                </App.Flex>
            )
          })
        }
      </App.Container>
  )
}

export default Leaderboard
