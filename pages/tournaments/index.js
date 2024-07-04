import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'

import $gem from '@/store/gem'
import $token from '@/store/token'

import App from '@/components/App'
import GemsCountdownBrett from '@/components/Gems/GemsCountdownBrett'
import TournamentBanner from '@/components/Tournament/TournamentBanner'

import styles from './styles.module.scss'
import WagmiHelper from '@/libs/WagmiHelper'

const Tournaments = () => {
  const router = useRouter()

  const dispatch = useDispatch()
  const tournaments = useSelector(({ $gem }) => $gem.tournaments)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    const result = await $gem.api.tournaments()
    if (result) {
      dispatch($gem.set.tournaments(result))
    }
    setLoading(false)
  }

  const handleExchange = (tournament) => () => {
    Amplitude.event(`Tournament Trade ${tournament.name}`, {
      'Page': Amplitude.page(),
    })

    if (tournament.contracts && tournament.contracts.length) {
      const contract = tournament.contracts[0]
      dispatch($token.set.current({}))
      router.push(`/exchange/${WagmiHelper.getChainCodeById(contract.chain_id)}/${contract.address.toLowerCase()}`)
    } else {
      if (tournament?.bonus_contract) {
        dispatch($token.set.current({}))
        router.push(`/exchange/base/${tournament.bonus_contract.toLowerCase()}`)
      }
    }
  }

  const getColor = (position, reward) => {
    switch (position) {
      case 1: return '#E3A951'
      case 2: return '#D3D3D3'
      case 3: return '#DC7225'
      default: return reward ? '#7364FF' : '#9281C5'
    }
  }

  const getShort = (address) => {
    const n = 4
    return address == '-' ? address : `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  const handleFinish = (key, status) => () => {
    dispatch($gem.set.tournamentStatus({key, status}))
  }

  const getSortedKeys = () => {
    return Object.keys(tournaments).sort((a, b) => {
      if (tournaments[a].status == 'on-going') return -1
      if (tournaments[b].status == 'on-going') return 1
      if (tournaments[a].status == 'upcoming') return -1
      if (tournaments[b].status == 'upcoming') return 1
      if (tournaments[a].status == 'closed' && tournaments[b].status == 'closed') {
        return new Date(tournaments[b].end_time) - new Date(tournaments[a].end_time)
      }
      if (tournaments[a].status == 'closed') return -1
      if (tournaments[b].status == 'closed') return 1
      return 0
    })
  }

  const handleShowToggle = (key) => () => {
    dispatch($gem.set.tournamentExpand(key))
  }

  const getOngoingTournament = () => {
    const key = Object.keys(tournaments).find(key => tournaments[key].status == 'on-going')
    if (key) {
      return tournaments[key]
    }

    return null
  }

  const getPool = (rewards) => {
    let pool = 0
    rewards.forEach(reward => {
      pool += reward.reward
    })
    return pool.toLocaleString('en-US')
  }

  const getBannersList = () => {
    const result = []
    if (getOngoingTournament()) {
      result.push(<TournamentBanner tournament={getOngoingTournament()} />)
    }

    return result
  }

  const getTooltip = (currency) => {
    return (
      <App.Flex column gap={8}>
        {currency ? <App.Text size={14} weight={400}>Earn gems by trading {currency} tokens</App.Text> : null}
        <App.Text size={14} weight={400}>Get a per minute gem boost <App.Text inline size={14} weight={400} color="#8DC8FF">(e.g. +10/hr)</App.Text> on your open orders.</App.Text>
      </App.Flex>
    )
  }

  return (
    <App.Flex className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column gap={48} sx={{ paddingTop: 32 }}>
          <App.Text size={24} weight={700} height={1}>Tournaments</App.Text>

          {!loading ? (
            getBannersList().map((item, index) => (
              <App.Flex key={index}>
                {item}
              </App.Flex>
            ))
          ) : null}
          
          {loading ? (
            <App.LoaderBlock height={200} />
          ) : (
            getSortedKeys().length ? (
              getSortedKeys().map((key, index) => {
                const tournament = tournaments[key]
                return (
                  <App.Flex column key={index} gap={16}>
                    <App.Flex direction={['row', 'column']} gap={16} fullWidth className={styles.header} align="center" justify="space-between">
                      <App.Flex direction={['row', 'column']} fullWidth gap={[24, 8]} align={['center', 'flex-start']} justify={['flex-start', 'space-between']}>
                        <App.Flex row align="center" gap={8}>
                          <Image src={`/images/${key}-logo.png`} width={24} height={24} alt="" />
                          <App.Text nowrap uppercase size={16} weight={700} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">{tournament.name}</App.Text>
                        </App.Flex>

                        <App.Flex row gap={16} align="center">
                          {tournament.status != 'on-going' ? (
                            <App.Flex center className={cn(styles.badge, styles[tournament.status])}>
                              <App.Text uppercase center size={12} weight={700} height={1} color={tournament.status == 'closed' ? '#6F6C88' : '#DC7225'}>{tournament.status}</App.Text>
                            </App.Flex>
                          ) : null}

                          {tournament.status == 'closed' ? (
                            <App.Flex center gap={8} className={cn(styles.prize)}>
                              <App.Icon icon="prize" />
                              <App.Text uppercase center size={12} weight={700} height={1} color="#FFCB45">{getPool(tournament.rewards)} ${tournament.currency}</App.Text>
                            </App.Flex>
                          ) : (
                            // tournament.status == 'on-going' ? (
                            //   <App.Flex row center gap={16} className={styles.x}>
                            //     <App.Flex column center gap={4}>
                            //       <App.Text size={20} weight={700} height={1} color="#FFBD13">2X</App.Text>
                            //       <App.Text nowrap size={12} weight={700} height={1} color="#FFBD13">Prize pool</App.Text>
                            //     </App.Flex>

                            //     <App.Flex column gap={8}>
                            //       <App.Text size={12} weight={400} height={1}>56 participants <App.Text inline size={12} weight={400} height={1} color="#FFFFFF66">left</App.Text></App.Text>

                            //       <App.Flex className={styles.bar}>
                            //         <App.Flex className={styles.innerBar} width="12%">
                            //         </App.Flex>
                            //       </App.Flex>

                            //       <App.Flex align="center" justify="space-between">
                            //         <App.Text size={10} weight={600} height={1}>2500 BRETT</App.Text>
                            //         <App.Text size={10} weight={600} height={1}>5000 BRETT</App.Text>
                            //       </App.Flex>
                            //     </App.Flex>
                            //   </App.Flex>
                            // ) : null
                            null
                          )}
                        </App.Flex>
                      </App.Flex>
                      
                      <App.Flex row gap={24} fullWidth align="center" justify={['flex-end', 'space-between']}>
                        {tournament.status == 'upcoming' ? (
                          <App.Flex row center gap={8}>
                            {!isMobile ? (
                              <App.Text nowrap size={14} weight={400} height={1} color="#FFFFFF99">Starts in</App.Text>
                            ) : null}
                            <GemsCountdownBrett endTime={tournament.start_time} onFinish={handleFinish(key, 'on-going')} />
                          </App.Flex>
                        ) : (
                          tournament.status == 'on-going' ? (
                            <App.Flex row center gap={8}>
                              {!isMobile ? (
                                <App.Text nowrap size={14} weight={400} height={1} color="#FFFFFF99">Ends in</App.Text>
                              ) : null}
                              <GemsCountdownBrett endTime={tournament.end_time} onFinish={handleFinish(key, 'closed')} />
                            </App.Flex>
                          ) : null
                        )}

                        {tournament.status == 'on-going' ? (
                          <App.Button primary2 onClick={handleExchange(tournament)}>Trade now</App.Button>
                        ) : (
                          <App.Button primary2 outlined fullWidth={isMobile} href="https://discord.com/invite/tegro"><App.Icon icon="discord2" />Join Discord {tournament.status == 'closed' ? 'To Claim Rewards' : ''}</App.Button>
                        )}
                      </App.Flex>
                    </App.Flex>
                    
                    <App.Flex column className={styles.table}>
                      <App.Flex row gap={8} className={styles.row}>
                        <App.Flex width={[50, 30]} center>
                          <App.Text center weight={400} height={1} color="#A6DC37">№</App.Text>
                        </App.Flex>

                        <App.Flex width={[200, 80]} align="center">
                          <App.Text weight={400} height={1} color="#A6DC37">{isMobile ? '' : 'Wallet '}Address</App.Text>
                        </App.Flex>

                        <App.Flex gap={4} flex={1} center>
                          <App.Text center weight={400} height={1} color="#A6DC37">Gems{isMobile ? '' : ' Earned'}</App.Text>
                          <App.Tooltip variant="v2" text={getTooltip(tournament.currency)} placement={isMobile ? 'bottom' : 'right'}>
                            <App.Icon icon="info2" />
                          </App.Tooltip>
                        </App.Flex>

                        <App.Flex width={['auto', 70]} flex={[1, null]} align="center" justify="flex-end">
                          <App.Text right weight={400} height={1} color="#A6DC37">Rewards</App.Text>
                        </App.Flex>
                      </App.Flex>

                      {tournament?.leaderboard && tournament.leaderboard.length ? (
                        <>
                          {tournament.leaderboard.map((item, i) => {
                            if (tournament.status == 'closed' && tournament.expand == false && i >= 5) {
                              return null
                            }

                            return (
                              <App.Flex key={i} row gap={8} className={styles.row}>
                                <App.Flex width={[50, 30]} center>
                                  <svg width={isMobile ? 24 : 48} height={isMobile ? 24 : 48} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke={getColor(item.position, item.reward ?? 0)} d="M20.3335 1.32781C21.1453 0.147992 22.8876 0.147992 23.6995 1.32781C24.6494 2.70814 26.5364 3.06089 27.9207 2.11689C29.104 1.31002 30.7286 1.93942 31.0595 3.33285C31.4465 4.9631 33.0787 5.97369 34.7106 5.59352C36.1054 5.26858 37.393 6.44237 37.1981 7.86121C36.9701 9.52121 38.127 11.0532 39.786 11.2882C41.204 11.489 41.9807 13.0487 41.2864 14.3013C40.4742 15.7669 40.9995 17.6133 42.4616 18.4317C43.7113 19.1313 43.8721 20.8662 42.7722 21.7834C41.4854 22.8566 41.3083 24.7681 42.376 26.0594C43.2886 27.1632 42.8118 28.839 41.4548 29.297C39.8672 29.8328 39.0115 31.5513 39.5406 33.1411C39.9929 34.5 38.9429 35.8904 37.5121 35.8273C35.8382 35.7534 34.4195 37.0467 34.3386 38.7203C34.2694 40.1508 32.7881 41.0681 31.4767 40.4923C29.9425 39.8188 28.1524 40.5123 27.4724 42.0436C26.8911 43.3525 25.1785 43.6727 24.1636 42.6621C22.9763 41.4799 21.0566 41.4799 19.8693 42.6621C18.8545 43.6727 17.1418 43.3525 16.5606 42.0436C15.8805 40.5123 14.0905 39.8188 12.5562 40.4923C11.2449 41.0681 9.76353 40.1508 9.69436 38.7203C9.61343 37.0467 8.19476 35.7534 6.52081 35.8273C5.09004 35.8904 4.04006 34.5 4.49231 33.1411C5.02143 31.5513 4.16575 29.8328 2.57816 29.297C1.22121 28.839 0.744403 27.1632 1.657 26.0594C2.72471 24.7681 2.54758 22.8566 1.26077 21.7834C0.160898 20.8662 0.321658 19.1313 1.57135 18.4317C3.03344 17.6133 3.55879 15.7669 2.74655 14.3013C2.0523 13.0487 2.82892 11.489 4.24693 11.2882C5.90594 11.0532 7.06282 9.5212 6.83484 7.86121C6.63998 6.44237 7.92757 5.26858 9.32238 5.59352C10.9543 5.97369 12.5864 4.9631 12.9735 3.33285C13.3043 1.93942 14.929 1.31002 16.1122 2.11689C17.4966 3.06089 19.3836 2.70814 20.3335 1.32781Z" />
                                  </svg>
                                  <App.Text color={getColor(item.position, item.reward ?? 0)} size={[16, 8]} weight={400} sx={{position: 'absolute'}}>{item.position}</App.Text>
                                </App.Flex>

                                <App.Flex width={[200, 80]} align="center">
                                  <App.Text weight={400} height={1}>{getShort(item.wallet_address)}</App.Text>
                                </App.Flex>

                                <App.Flex gap={4} flex={1} center>
                                  <App.Text center weight={400} height={1}>{item.points}</App.Text>
                                  {item.points_per_hour > 0 ? (
                                    <App.Tooltip variant="v2" text={getTooltip()} placement={isMobile ? 'bottom' : 'right'}>
                                      <App.Flex center gap={4}>
                                        <App.Text weight={400} height={1}>+</App.Text>
                                        <App.Text weight={400} height={1} color="#68C9F9">{item.points_per_hour}/hr</App.Text>
                                        {!isMobile ? (
                                          <App.Flex sx={{ marginTop: -10 }}>
                                            <Image src="/images/gem-animate.gif" width={32} height={32} />
                                          </App.Flex>
                                        ) : null}
                                      </App.Flex>
                                    </App.Tooltip>
                                  ) : null}
                                </App.Flex>

                                <App.Flex width={['auto', 70]} flex={[1, null]} align="center" justify="flex-end">
                                  {item.reward > 0 ? (
                                    <App.Text right weight={400} height={1}>{item.reward} {item.reward_currency}</App.Text>
                                  ) : null}
                                </App.Flex>
                              </App.Flex>
                            )}
                          )}

                          {tournament.status == 'closed' ? (
                            <App.Flex center sx={{ padding: 16, cursor: 'pointer' }} onClick={handleShowToggle(key)}>
                              <App.Text size={14} weight={600} height={1} color="#6B41EB">{tournament.expand ? 'Show less' : 'Show all'}</App.Text>
                            </App.Flex>
                          ) : null}
                        </>
                      ) : (
                        <App.Flex center height={200}>
                          <App.Text>There are no participants yet</App.Text>
                        </App.Flex>
                      )}
                    </App.Flex>

                    {tournament.status == 'on-going' && tournament.leaderboard.filter(item => item.points > 0).length <= 5 ? (
                      <App.Flex direction={['row', 'column']} center gap={24}>
                        <App.Text center size={20} weight={400} height={1}>{`Trade ${tournament.currency} to start collecting gems 🚀`}</App.Text>
                        <App.Button secondary2 outlined onClick={handleExchange(tournament)}>{`Trade ${tournament.currency}`}</App.Button>
                      </App.Flex>
                    ) : null}
                  </App.Flex>
                )
              })
            ) : (
              <App.Flex center height={200}>
                <App.Text>There are no tournaments yet</App.Text>
              </App.Flex>
            )
          )}
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default Tournaments