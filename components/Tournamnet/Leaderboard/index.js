import styles from './styles.module.scss'
import App from '@/components/App'
import Image from 'next/image'
import cn from 'classnames'

const Leaderboard = ({leaderboard, walletResults, onClickWorks}) => {
  const handleClickWorks = () => {
    onClickWorks()
  }
  return (
      <App.Container>
        <App.Flex>
          <App.Flex column flex={1} gap={16}>
            <App.Flex column>
              <App.Text weight={800} size={64} sx={{lineHeight: 1}}>Tournament</App.Text>
              <App.Text family={'Playfair Display'} size={64} color={'#A6DC37'}>Leaders</App.Text>
            </App.Flex>
            <App.Text size={12} weight={400} color={'#9B99AE'}>Rutrum faucibus donec quisque nisi eget adipiscing vel nullam metus. Semper in elementum curabitur nibh urna. Ut ut nec ultricies ac eget euismod at. Nec faucibus in sagittis ultricies imperdiet. Vivamus in euismod egestas pellentesque semper quisque ut risus. Donec a mattis condimentum etiam proin. Aliquam porttitor et id amet suspendisse sapien interdum. Sed.</App.Text>
            <App.Text color={'#A6DC37'} size={14} weight={600} onClick={handleClickWorks}>{`How It Works? >`}</App.Text>
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
            <App.Text color={'#7364FF'} size={14} weight={600}>Wallet</App.Text>
          </App.Flex>
          <App.Flex flex={1} justify={'center'}>
            <App.Text color={'#7364FF'} size={14} weight={600}>Earned</App.Text>
          </App.Flex>
          <App.Flex justify={'flex-end'} width={120}>
            <App.Text color={'#7364FF'} size={14} weight={600}>Reward</App.Text>
          </App.Flex>
        </App.Flex>
        <App.Flex column className={styles.leaderboard}>
          {
            leaderboard.map((item) => {
              return (
                <App.Flex column key={item.wallet_address}>
                  <App.Flex  className={cn(styles.row, {[styles.active]: item.wallet_address === walletResults.address})} align={'center'}>
                    <App.Flex justify={'center'} align={'center'} width={50} sx={{position: 'relative'}}>
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.3335 1.32781C21.1453 0.147992 22.8876 0.147992 23.6995 1.32781C24.6494 2.70814 26.5364 3.06089 27.9207 2.11689C29.104 1.31002 30.7286 1.93942 31.0595 3.33285C31.4465 4.9631 33.0787 5.97369 34.7106 5.59352C36.1054 5.26858 37.393 6.44237 37.1981 7.86121C36.9701 9.52121 38.127 11.0532 39.786 11.2882C41.204 11.489 41.9807 13.0487 41.2864 14.3013C40.4742 15.7669 40.9995 17.6133 42.4616 18.4317C43.7113 19.1313 43.8721 20.8662 42.7722 21.7834C41.4854 22.8566 41.3083 24.7681 42.376 26.0594C43.2886 27.1632 42.8118 28.839 41.4548 29.297C39.8672 29.8328 39.0115 31.5513 39.5406 33.1411C39.9929 34.5 38.9429 35.8904 37.5121 35.8273C35.8382 35.7534 34.4195 37.0467 34.3386 38.7203C34.2694 40.1508 32.7881 41.0681 31.4767 40.4923C29.9425 39.8188 28.1524 40.5123 27.4724 42.0436C26.8911 43.3525 25.1785 43.6727 24.1636 42.6621C22.9763 41.4799 21.0566 41.4799 19.8693 42.6621C18.8545 43.6727 17.1418 43.3525 16.5606 42.0436C15.8805 40.5123 14.0905 39.8188 12.5562 40.4923C11.2449 41.0681 9.76353 40.1508 9.69436 38.7203C9.61343 37.0467 8.19476 35.7534 6.52081 35.8273C5.09004 35.8904 4.04006 34.5 4.49231 33.1411C5.02143 31.5513 4.16575 29.8328 2.57816 29.297C1.22121 28.839 0.744403 27.1632 1.657 26.0594C2.72471 24.7681 2.54758 22.8566 1.26077 21.7834C0.160898 20.8662 0.321658 19.1313 1.57135 18.4317C3.03344 17.6133 3.55879 15.7669 2.74655 14.3013C2.0523 13.0487 2.82892 11.489 4.24693 11.2882C5.90594 11.0532 7.06282 9.5212 6.83484 7.86121C6.63998 6.44237 7.92757 5.26858 9.32238 5.59352C10.9543 5.97369 12.5864 4.9631 12.9735 3.33285C13.3043 1.93942 14.929 1.31002 16.1122 2.11689C17.4966 3.06089 19.3836 2.70814 20.3335 1.32781Z" stroke="#A6DC37"/>
                      </svg>
                      <App.Text sx={{position: 'absolute', marginBottom: 5}} family={'Playfair Display'} color={'#A6DC37'} size={16} weight={600}>{item.position}</App.Text>
                    </App.Flex>
                    <App.Flex flex={1} sx={{paddingLeft: 30}} className={styles.addressRow}>
                      <App.Text sx={{textOverflow: 'ellipsis', overflow: 'hidden'}} size={16} family={'Playfair Display'}>{item.wallet_address}</App.Text>
                    </App.Flex>
                    <App.Flex flex={1} justify={'center'}>
                      <App.Text size={14} family={'Playfair Display'} sx={{lineHeight: 1.2}}>{item.points}</App.Text>
                    </App.Flex>
                    <App.Flex justify={'flex-end'} width={120}>
                      <App.Text size={14} family={'Playfair Display'} sx={{lineHeight: 1.2}}>{item.reward}</App.Text>
                      &nbsp;
                      <App.Text color={'#9B99AE'} size={14} weight={600}>{item.reward_currency}</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              )
            })
          }
        </App.Flex>
      </App.Container>
  )
}

export default Leaderboard
