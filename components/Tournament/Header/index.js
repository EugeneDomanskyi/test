import App from '@/components/App'
import styles from './styles.module.scss'
import useWalletConnect from "@/myhooks/wallet-connect";
import Button from '@/components/Tournament/Button'
import Link from "next/link";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

const Header = () => {
  const { wallet, connect, disconnect } = useWalletConnect()
  const router = useRouter()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const handleConnect = () => {
    wallet ? disconnect() : connect()
  }

  return (
      <App.Container fluid>
        <App.Flex align={'center'} gap={48} className={styles.container}>
          <Link href="/" style={{ lineHeight: 0 }}>
            {
              isMobile
                  ? <App.Icon icon="tegro" width={91} height={20} />
                  : <div className={styles.logo}>
                    <div className={styles.badge}>
                      TESTNET
                    </div>
                    <App.Icon icon="tegro" width={117} height={25} />
                  </div>
            }
          </Link>
          <Link href={"https://tegro.com"}>
            <Button sx={{height: 36}}>tegro.com &#8599;</Button>
          </Link>
          <App.Flex align={'center'} gap={48} sx={{marginLeft: 'auto'}}>
            <Link href={'/exchange'}>
              <App.Text size={14} weight={600}>Exchange</App.Text>
            </Link>
            <Link href={router.asPath}>
              <App.Text color={'#A6DC37'} size={14} weight={600}>Earn</App.Text>
            </Link>
            <Button onClick={handleConnect}>
              {wallet ? 'Disconnect' : 'Connect Wallet'}
            </Button>
          </App.Flex>
        </App.Flex>
      </App.Container>
  )
}

export default Header
