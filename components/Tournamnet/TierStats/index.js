import App from '@/components/App'
import cn from 'classnames'
import numeral from 'numeral'

import styles from './styles.module.scss'
import useWalletConnect from "@/myhooks/wallet-connect";
import Button from "@/components/Tournamnet/Button";
import Link from "next/link";

const TierStats = ({walletResults, onClickWorks}) => {
  const formattedAddress = `${walletResults.address?.slice(0,4)}.....${walletResults.address?.slice(-4)}`
  const { wallet, connect } = useWalletConnect()

  const handleConnect = () => {
    connect()
  }

  return (
      <>
        <App.Flex flex={1} gap={24} className={styles.desktop}>
          <App.Flex column gap={24} flex={1} justify={'flex-end'}>
            <App.Flex width={'100%'}>
              <App.Flex column align={'center'} justify={'center'} className={styles.plate} flex={1} height={180}>
                <App.Text size={20} weight={700}>Volume</App.Text>
                <App.Text family={'Playfair Display'} size={20} weight={700}>Exectuted</App.Text>
                <App.Text size={48} weight={700}>{numeral(walletResults.volume).format('0.[0]a')}</App.Text>
                <Link href={`/exchange`}>
                  <App.Text color={'#A6DC37'} size={14} weight={600}>{`Trade now`}</App.Text>
                </Link>
              </App.Flex>
            </App.Flex>
            <App.Flex column align={'center'} justify={'center'} className={cn(styles.plate, styles.color)} height={250} width={'100%'}>
              <App.Flex>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{marginBottom: 16}}>
                  <path
                      d="M19.9216 1.04437C20.9321 -0.424195 23.1008 -0.424195 24.1114 1.04437C24.9052 2.1979 26.4821 2.49268 27.639 1.70379C29.1119 0.699458 31.1341 1.48289 31.5459 3.21734C31.8694 4.57972 33.2334 5.42426 34.5971 5.10656C36.3333 4.70209 37.936 6.16315 37.6935 7.92924C37.503 9.31648 38.4697 10.5967 39.8562 10.7931C41.6212 11.0431 42.5879 12.9845 41.7237 14.5437C41.045 15.7684 41.484 17.3115 42.7058 17.9954C44.2614 18.8662 44.4615 21.0257 43.0924 22.1674C42.0171 23.0642 41.869 24.6617 42.7613 25.7408C43.8972 27.1147 43.3037 29.2006 41.6147 29.7707C40.288 30.2185 39.5729 31.6546 40.0151 32.9832C40.578 34.6747 39.2711 36.4053 37.4901 36.3268C36.0912 36.2651 34.9056 37.3459 34.838 38.7445C34.7519 40.5251 32.908 41.6668 31.2757 40.9502C29.9936 40.3873 28.4977 40.9668 27.9294 42.2466C27.2058 43.8758 25.074 44.2743 23.8108 43.0164C22.8186 42.0284 21.2143 42.0284 20.2221 43.0164C18.9589 44.2743 16.8271 43.8758 16.1036 42.2466C15.5353 40.9668 14.0394 40.3873 12.7572 40.9502C11.1249 41.6668 9.28105 40.5251 9.19495 38.7445C9.12732 37.3459 7.94174 36.2651 6.54285 36.3268C4.76191 36.4053 3.45496 34.6747 4.0179 32.9832C4.46008 31.6546 3.74499 30.2185 2.41827 29.7707C0.729213 29.2006 0.135714 27.1147 1.27166 25.7408C2.16393 24.6617 2.0159 23.0642 0.940534 22.1674C-0.42852 21.0257 -0.228416 18.8662 1.32712 17.9954C2.54898 17.3115 2.98801 15.7684 2.30923 14.5437C1.44507 12.9845 2.41175 11.0431 4.1768 10.7931C5.56322 10.5967 6.53001 9.31648 6.33949 7.92924C6.09694 6.16315 7.69965 4.70209 9.43583 5.10656C10.7996 5.42426 12.1635 4.57972 12.487 3.21734C12.8988 1.48289 14.9211 0.699459 16.3939 1.70379C17.5508 2.49268 19.1278 2.1979 19.9216 1.04437Z"
                      fill="white"/>
                </svg>
              </App.Flex>
              <App.Text size={20} weight={700}>Volume</App.Text>
              <App.Text size={20} weight={700}><App.Text inline family={'Playfair Display'} size={20}>Required</App.Text> for</App.Text>
              <App.Text size={20} weight={700}>Next Tier</App.Text>
              <App.Text size={48} weight={700}>{walletResults.volume_remaining}</App.Text>
            </App.Flex>
          </App.Flex>
          <App.Flex column gap={24} flex={2} sx={{paddingBottom: 40}}>
            <App.Flex gap={24} flex={1} align={'flex-end'}>
              <App.Flex column className={cn(styles.plate, styles.wallet)} flex={1} height={286}>
                <App.Text size={20} weight={700}>My</App.Text>
                <App.Text size={20} weight={700} family={'Playfair Display'}>Wallet</App.Text>
                {
                  wallet
                      ? <App.Flex align={'center'} gap={8}>
                        <App.Text size={14} weight={400}>{formattedAddress}</App.Text>
                        <App.Icon icon={'copy'}/>
                      </App.Flex>
                      : <App.Flex column flex={1} justify={'space-between'}>
                        <App.Text color={'#9B99AE'} size={14} weight={400}>Lorem hendrerit massa posuere a sed faucibus viverra urna lectus.</App.Text>
                        <Button onClick={handleConnect}>Connect</Button>
                      </App.Flex>
                }
              </App.Flex>
              <App.Flex column align={'center'} justify={'center'} className={cn(styles.plate, styles.color)} flex={1} height={180}>
                <App.Text size={20} weight={700}>Points</App.Text>
                <App.Text family={'Playfair Display'} size={20} weight={700}>Earned</App.Text>
                <App.Text size={48} weight={700}>{walletResults.points}</App.Text>
                <App.Text color={'#A6DC37'} size={14} weight={600} onClick={onClickWorks}>{`How It Works? >`}</App.Text>
              </App.Flex>
            </App.Flex>
            <App.Flex>
              <App.Flex column className={cn(styles.plate, styles.position)} flex={1} height={180}>
                <App.Text size={20} weight={700}>Current <App.Text inline family={'Playfair Display'} size={20}>Position</App.Text></App.Text>
                <App.Text size={48} weight={700}>{walletResults.position}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
        <App.Flex flex={1} gap={24} column className={styles.mobile}>
          <App.Flex gap={16} flex={1}>
            <App.Flex column className={cn(styles.plate, styles.wallet)} flex={1}>
              <App.Text size={20} weight={700}>My</App.Text>
              <App.Text size={20} weight={700} family={'Playfair Display'}>Wallet</App.Text>
              {
                wallet
                    ? <App.Flex align={'center'} gap={8}>
                      <App.Text size={14} weight={400}>{formattedAddress}</App.Text>
                      <App.Icon icon={'copy'}/>
                    </App.Flex>
                    : <App.Flex column flex={1} justify={'space-between'}>
                      <App.Text color={'#9B99AE'} size={14} weight={400}>Lorem hendrerit massa posuere a sed faucibus viverra urna lectus.</App.Text>
                      <Button onClick={handleConnect}>Connect</Button>
                    </App.Flex>
              }
            </App.Flex>
            <App.Flex flex={1} column gap={16}>
              <App.Flex column align={'center'} justify={'center'} className={cn(styles.plate, styles.color)} flex={1} height={180}>
                <App.Text size={20} weight={700}>Points</App.Text>
                <App.Text family={'Playfair Display'} size={20} weight={700}>Earned</App.Text>
                <App.Text size={48} weight={700}>{walletResults.points}</App.Text>
              </App.Flex>
              <App.Flex column align={'center'} justify={'center'} className={styles.plate} flex={1} height={180}>
                <App.Text size={20} weight={700}>Volume</App.Text>
                <App.Text family={'Playfair Display'} size={20} weight={700}>Exectuted</App.Text>
                <App.Text size={48} weight={700}>{numeral(walletResults.volume).format('0.[0]a')}</App.Text>
                <App.Text color={'#A6DC37'} size={14} weight={600} onClick={onClickWorks}>{`How It Works? >`}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
          <App.Flex>
            <App.Flex column align={'center'} justify={'center'} className={cn(styles.plate, styles.color)} height={250} width={'100%'}>
              <App.Flex>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{marginBottom: 16}}>
                  <path
                      d="M19.9216 1.04437C20.9321 -0.424195 23.1008 -0.424195 24.1114 1.04437C24.9052 2.1979 26.4821 2.49268 27.639 1.70379C29.1119 0.699458 31.1341 1.48289 31.5459 3.21734C31.8694 4.57972 33.2334 5.42426 34.5971 5.10656C36.3333 4.70209 37.936 6.16315 37.6935 7.92924C37.503 9.31648 38.4697 10.5967 39.8562 10.7931C41.6212 11.0431 42.5879 12.9845 41.7237 14.5437C41.045 15.7684 41.484 17.3115 42.7058 17.9954C44.2614 18.8662 44.4615 21.0257 43.0924 22.1674C42.0171 23.0642 41.869 24.6617 42.7613 25.7408C43.8972 27.1147 43.3037 29.2006 41.6147 29.7707C40.288 30.2185 39.5729 31.6546 40.0151 32.9832C40.578 34.6747 39.2711 36.4053 37.4901 36.3268C36.0912 36.2651 34.9056 37.3459 34.838 38.7445C34.7519 40.5251 32.908 41.6668 31.2757 40.9502C29.9936 40.3873 28.4977 40.9668 27.9294 42.2466C27.2058 43.8758 25.074 44.2743 23.8108 43.0164C22.8186 42.0284 21.2143 42.0284 20.2221 43.0164C18.9589 44.2743 16.8271 43.8758 16.1036 42.2466C15.5353 40.9668 14.0394 40.3873 12.7572 40.9502C11.1249 41.6668 9.28105 40.5251 9.19495 38.7445C9.12732 37.3459 7.94174 36.2651 6.54285 36.3268C4.76191 36.4053 3.45496 34.6747 4.0179 32.9832C4.46008 31.6546 3.74499 30.2185 2.41827 29.7707C0.729213 29.2006 0.135714 27.1147 1.27166 25.7408C2.16393 24.6617 2.0159 23.0642 0.940534 22.1674C-0.42852 21.0257 -0.228416 18.8662 1.32712 17.9954C2.54898 17.3115 2.98801 15.7684 2.30923 14.5437C1.44507 12.9845 2.41175 11.0431 4.1768 10.7931C5.56322 10.5967 6.53001 9.31648 6.33949 7.92924C6.09694 6.16315 7.69965 4.70209 9.43583 5.10656C10.7996 5.42426 12.1635 4.57972 12.487 3.21734C12.8988 1.48289 14.9211 0.699459 16.3939 1.70379C17.5508 2.49268 19.1278 2.1979 19.9216 1.04437Z"
                      fill="white"/>
                </svg>
              </App.Flex>
              <App.Text size={20} weight={700}>Volume Required for Next Tier</App.Text>
              <App.Text size={48} weight={700}>{walletResults.volume_remaining}</App.Text>
            </App.Flex>
          </App.Flex>
          <App.Flex>
            <App.Flex column className={cn(styles.plate, styles.position)} flex={1} height={180}>
              <App.Text size={20} weight={700}>Current <App.Text inline family={'Playfair Display'} size={20}>Position</App.Text></App.Text>
              <App.Text size={48} weight={700}>{walletResults.position}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </>

  )
}

export default TierStats
