import App from '@/components/App'

import styles from './styles.module.scss'

import ProgressBar from "@/components/Tournamnet/ProgressBar";
import useWalletConnect from "@/myhooks/wallet-connect";
import Button from "@/components/Tournamnet/Button";

const TierInfo = ({walletResults}) => {
  const { wallet, connect } = useWalletConnect()
  const percentage = walletResults.volume ? walletResults.volume*100/(walletResults.volume+walletResults.volume_remaining) : 0

  const handleConnect = () => {
    connect()
  }

  return (
      <App.Flex className={styles.container}>
        <App.Flex flex={1} column>
          <App.Flex sx={{position: 'relative'}} className={styles.tierInfo}>
            <App.Flex align={'center'} justify={'center'} sx={{position: 'relative', marginBottom: 16}}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M19.9216 1.04437C20.9321 -0.424195 23.1008 -0.424195 24.1114 1.04437C24.9052 2.1979 26.4821 2.49268 27.639 1.70379C29.1119 0.699458 31.1341 1.48289 31.5459 3.21734C31.8694 4.57972 33.2334 5.42426 34.5971 5.10656C36.3333 4.70209 37.936 6.16315 37.6935 7.92924C37.503 9.31648 38.4697 10.5967 39.8562 10.7931C41.6212 11.0431 42.5879 12.9845 41.7237 14.5437C41.045 15.7684 41.484 17.3115 42.7058 17.9954C44.2614 18.8662 44.4615 21.0257 43.0924 22.1674C42.0171 23.0642 41.869 24.6617 42.7613 25.7408C43.8972 27.1147 43.3037 29.2006 41.6147 29.7707C40.288 30.2185 39.5729 31.6546 40.0151 32.9832C40.578 34.6747 39.2711 36.4053 37.4901 36.3268C36.0912 36.2651 34.9056 37.3459 34.838 38.7445C34.7519 40.5251 32.908 41.6668 31.2757 40.9502C29.9936 40.3873 28.4977 40.9668 27.9294 42.2466C27.2058 43.8758 25.074 44.2743 23.8108 43.0164C22.8186 42.0284 21.2143 42.0284 20.2221 43.0164C18.9589 44.2743 16.8271 43.8758 16.1036 42.2466C15.5353 40.9668 14.0394 40.3873 12.7572 40.9502C11.1249 41.6668 9.28105 40.5251 9.19495 38.7445C9.12732 37.3459 7.94174 36.2651 6.54285 36.3268C4.76191 36.4053 3.45496 34.6747 4.0179 32.9832C4.46008 31.6546 3.74499 30.2185 2.41827 29.7707C0.729213 29.2006 0.135714 27.1147 1.27166 25.7408C2.16393 24.6617 2.0159 23.0642 0.940534 22.1674C-0.42852 21.0257 -0.228416 18.8662 1.32712 17.9954C2.54898 17.3115 2.98801 15.7684 2.30923 14.5437C1.44507 12.9845 2.41175 11.0431 4.1768 10.7931C5.56322 10.5967 6.53001 9.31648 6.33949 7.92924C6.09694 6.16315 7.69965 4.70209 9.43583 5.10656C10.7996 5.42426 12.1635 4.57972 12.487 3.21734C12.8988 1.48289 14.9211 0.699459 16.3939 1.70379C17.5508 2.49268 19.1278 2.1979 19.9216 1.04437Z" fill="white"/>
              </svg>
              <App.Text size={28} sx={{position: 'absolute', transform: 'scaleX(-1)'}}>🚀</App.Text>
            </App.Flex>
          </App.Flex>
          {
            wallet
                ? <>
                    <App.Text weight={700} size={40}>Tier: <App.Text weight={700} size={40} family={'Playfair Display'} inline>{walletResults.tier?.title}</App.Text></App.Text>
                    <App.Text color={'#7364FF'} weight={400} size={12}>You are currently here</App.Text>
                    <App.Flex column className={styles.benefits}>
                      <App.Text weight={700} size={24} sx={{marginTop: 'auto'}}>Tier <App.Text inline color={'#7364FF'} family={'Playfair Display'} weight={700} size={24}>Benefits:</App.Text></App.Text>
                      <App.Text color={'#A6DC37'} size={18} weight={'700'} family={'Playfair Display'}>x{walletResults.tier?.multiplier}</App.Text>
                      <App.Text size={18} weight={600}>mauris tincidunt</App.Text>
                    </App.Flex>

                  </>
                : <>
                    <App.Text size={40} weight={700}>Start your</App.Text>
                    <App.Text size={40} weight={700} family={'Playfair Display'}>Journey</App.Text>
                    <App.Text color={'#9B99AE'} size={14} weight={400} sx={{marginTop: 'auto', marginBottom: 12}}>Eu metus
                      aliquam turpis commodo cursus. Volutpat tempus amet malesuada tincidunt.</App.Text>
                    <App.Flex className={styles.benefits}>
                      <Button onClick={handleConnect}>
                        Connect Wallet and Start
                      </Button>
                    </App.Flex>
                  </>
          }
        </App.Flex>
        <App.Flex flex={1} className={styles.progress}>
          <ProgressBar progress={Math.floor(percentage)}/>
        </App.Flex>
        <App.Flex width={'100%'} column className={styles.mobileBenefits}>
          {
            wallet
                ? <>
                    <App.Text weight={700} size={24} sx={{marginTop: 'auto'}}>Tier <App.Text inline color={'#7364FF'} family={'Playfair Display'} weight={700} size={24}>Benefits:</App.Text></App.Text>
                    <App.Text color={'#A6DC37'} size={18} weight={'700'} family={'Playfair Display'}>x{walletResults.tier?.multiplier}</App.Text>
                    <App.Text size={18} weight={600}>mauris tincidunt</App.Text>
                  </>
                : <Button onClick={handleConnect}>
                    Connect Wallet and Start
                  </Button>
          }
        </App.Flex>
      </App.Flex>
  )
}

export default TierInfo
