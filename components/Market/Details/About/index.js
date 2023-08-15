import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function About() {
  const { isMobile } = usePropsHelper()

  return (
    <App.Flex column gap={8}>
      <SectionTitle>About MetaSaga Warriors</SectionTitle>
      
      <App.Text size={isMobile ? 14 : 16} weight={500} color="#B9B8C5">
        MetaSaga Warriors is a roguelike dungeon crawler game where you command a party of warriors (known as diggers) on a mission to stop the corruption that encroached upon their paradise. These warriors, their parts, weapons, and other equipment are non-fungible tokens that can be traded on the blockchain to maximize the gaming experience and provide earning potential for the players.
        The game is being developed by MetaGaming Guild (MGG), a community-governed organization that offers Game-Fi solutions to thousands of players all around the globe. MetaSaga Warriors will be launched as MGG’s flagship game offer.
        Instead of being a play-to-earn game, MetaSaga Warriors aims to break away from the pack of NFT games in the market today by focusing on the Factory NFT model, where the emphasis is on the entertainment rather than the earning aspect. That is our governing principle from conceptualization and as we progress with the development, all the way to its release and continuity.
        At MetaSaga Warriors, we are driven to patronize a more sustainable gaming model that is appealing both from a gameplay and earning standpoint. We care about the storyline, your enjoyment, and the overall gaming experience that will make you truly engaged in the game.
        MetaSaga Warriors is set to be released in the first quarter of 2023.
      </App.Text>
    </App.Flex>
  )
}
