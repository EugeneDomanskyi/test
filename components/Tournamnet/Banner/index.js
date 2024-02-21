import styles from "./styles.module.scss";
import App from "@/components/App";
import Image from "next/image";
import Countdown from "@/components/Tournamnet/Countdown";
import Button from "@/components/Tournamnet/Button";
import moment from "moment";
import useWalletConnect from "@/myhooks/wallet-connect"
import Link from "next/link";

const Banner = ({tournament}) => {
  const { wallet, connect } = useWalletConnect()

  const handleConnect = () => {
    connect()
  }

  const isStarted = moment(new Date).isAfter(tournament.start_time)

  return (
      <App.Container>
        <App.Flex flex={1} className={styles.bannerContainer} gap={24}>
          <App.Flex column justify={'center'}>
            <Image
              src="/images/tournament/tournament_image.png"
              width={592}
              height={451}
              style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'cover'}} />
          </App.Flex>
          <App.Flex column justify={'center'} gap={16}>
            <App.Text tag="h1" family={'Playfair Display'} size={[64, 42]} color={'#7364FF'}><App.Text inline size={[64, 42]} weight={800}>{tournament.title}</App.Text> Championship</App.Text>
            <App.Text weight={400} size={16} color={'rgba(255,255,255,0.6)'}>{tournament.description}</App.Text>
            {
              tournament.status === 'active'
                ? isStarted
                  ? <Countdown endTime={tournament.end_time} />
                  : <App.Flex align={'flex-end'} gap={12}>
                        <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24}>Started in: </App.Text>
                        <Countdown endTime={tournament.start_time} />
                    </App.Flex>
                : <App.Flex align={'flex-end'} gap={12}>
                    <App.Text weight={700} family="Playfair Display" italic color={"#A6DC37"} size={24}>Closed at: </App.Text>
                    <App.Text weight={700} size={40} sx={{lineHeight: 1.1}}>{ moment(tournament.end_time).format('DD.MM.YYYY') }</App.Text>
                  </App.Flex>
            }
            <App.Flex gap={16}>
              <Link href={'https://blog.tegro.com/tegro-testnet-points-system-explained'} target="_blank" rel="noopener noreferrer">
                <Button>
                  Learn More
                </Button>
              </Link>


              {!wallet ? (
                <Button onClick={handleConnect}>
                  Connect Wallet and Start
                </Button>
              ) : null}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
  )
}

export default Banner
