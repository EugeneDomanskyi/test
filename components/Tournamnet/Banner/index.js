import styles from "./styles.module.scss";
import App from "@/components/App";
import Image from "next/image";
import Countdown from "@/components/Tournamnet/Countdown";
import Button from "@/components/Tournamnet/Button";

const Banner = ({tournament}) => {
  const handleClickMore = () => {
    const start = new Date(2024, 1, 1)
    const end = new Date(2024, 2, 1).setDate(0)
    const post = {
      title: 'February',
      description: 'some tournament',
      start_time: start,
      end_time: new Date(end),
      alias: 'february-tournament',
      tiers: [
      {
        title: 'Cub',
        description: '',
        level: 1,
        multiplier: 1,
        volume_required: 0,
      },
      {
        title: 'Simba',
        description: '',
        level: 2,
        multiplier: 1.5,
        volume_required: 100000,
      },
      {
        title: 'Mufasa',
        description: '',
        level: 3,
        multiplier: 2,
        volume_required: 1000000,
      }
      ],
      rewards: [{
        position: 1,
        reward: 5000,
        reward_currency: 'USDT',
      }, {
        position: 2,
        reward: 3000,
        reward_currency: 'USDT',
      }, {
        position: 3,
        reward: 1000,
        reward_currency: 'USDT',
      }],
    }
    console.log(post)
    // fetch(
    //     'http://localhost:8080/v2/tournament/create',
    //     {
    //       method: 'POST',
    //       body: JSON.stringify(post),
    //       headers: {'Content-Type': 'application/json'
    //       }
    //     }
    // )
  }
  return (
      <App.Container>
        <App.Flex flex={1} className={styles.bannerContainer} gap={24}>
          <App.Flex column justify={'center'}>
            <Image src="/images/tournament/tournament_image.png" width={592} height={451} />
          </App.Flex>
          <App.Flex column justify={'center'} gap={16}>
            <App.Text family={'Playfair Display'} size={64} color={'#7364FF'}><App.Text inline size={64} weight={800}>{tournament.title}</App.Text> Tournament</App.Text>
            <App.Text weight={400} size={12} color={'rgba(255,255,255,0.6)'}>{tournament.description}</App.Text>
            <Countdown endTime={tournament.end_time} />
            <App.Flex>
              <Button onClick={handleClickMore}>
                Learn More
              </Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
  )
}

export default Banner
