import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeStats = () => {
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ volume: 0, created: 0, gas: 0, settled: 0, cancelled: 0 })

  const date = moment().startOf('day').format('MMM DD, hh:mm A')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const calls = [
      $app.api.sevenDaysTradingVolume(),
      $app.api.totalOrdersCreated(),
      $app.api.gasSaved(),
      $app.api.totalTradesSettled(),
      $app.api.totalOrdersCancelled(),
    ]

    const [volume, created, gas, settled, cancelled] = await Promise.all(calls)
    const newStats = { ...stats }
    if (volume?.data) {
      const value = volume.data.rows[0][0]
      newStats.volume = formatNumber(value)
    }

    if (created?.data) {
      const value = created.data.rows[0][0]
      newStats.created = formatNumber(value)
    }

    if (gas?.data) {
      const value = gas.data.rows[0][0]
      newStats.gas = formatNumber(value)
    }

    if (settled?.data) {
      const value = settled.data.rows[0][0]
      newStats.settled = formatNumber(value)
    }

    if (cancelled?.data) {
      const value = cancelled.data.rows[0][0]
      newStats.cancelled = formatNumber(value)
    }

    setStats(newStats)
    setLoading(false)
  }

  const formatNumber = (number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q']
    let suffixIndex = 0
  
    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000
      suffixIndex++
    }
  
    return `${number.toFixed(1)}${suffixes[suffixIndex]}`
  }

  return !isMobile ? (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }} className={styles.container}>
      <App.Flex column gap={32}>
        <App.Text center size={[64, 48]} weight={700} height={1}>
          DEX with <App.Text inline italic size={[64, 48]} weight={700} height={1} family="Playfair Display" color="#A8DC43">Unmatched Gas Efficiency</App.Text><br />and <App.Text inline italic size={[64, 48]} weight={700} height={1} family="Playfair Display" color="#7364FF">Market Tools</App.Text>
        </App.Text>

        <App.Flex row fullWidth gap={16}>
          <App.Flex row flex={1} gap={16}>
            <App.Flex column flex={1} gap={16}>
              <App.Flex column center gap={32} className={styles.statsGradientBox}>
                <App.Flex center column>
                  <App.Text center size={24} weight={700} height={1.2}>Total Trades Settled</App.Text>
                  <App.Text center size={24} weight={700} italic family="Playfair Display">(On-chain)</App.Text>
                </App.Flex>
                
                {loading ? (
                  <App.Flex height={48} align="center" justify="center">
                    <App.Loader size={48} />
                  </App.Flex>
                ) : (
                  <App.Text size={48} weight={700} height={1}>{stats.settled}</App.Text>
                )}
              </App.Flex>

              <App.Flex column>
                <App.Text size={14} weight={400} color="#9B99AE" className={styles.bottomText}><a href="https://stats.tegro.com/?utm_source=home&utm_medium=tegro&utm_campaign=testnet" target="_blank" rel="noreferrer">View more stats &gt;</a></App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} column gap={8} className={cn(styles.statsBox, styles.noPadding)}>
              <App.Flex column full gap={12} justify="flex-end" className={styles.gasBack}>
                <App.Text size={24} weight={700} height={1}>Gas <App.Text inline size={24} weight={700} italic family="Playfair Display">Saved</App.Text></App.Text>

                {loading ? (
                  <App.Flex height={39} align="center">
                    <App.Loader size={39} />
                  </App.Flex>
                ) : (
                  <App.Text size={39} weight={800} height={1}>${stats.gas}</App.Text>
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column flex={1} gap={16}>
            <App.Flex row fullWidth align="center" justify="space-between" className={cn(styles.statsBox, styles.newGradient)}>
              <App.Flex column>
                <App.Text size={24} weight={700}>Total Orders</App.Text>
                <App.Text size={24} weight={700} italic family="Playfair Display">Created</App.Text>
              </App.Flex>

              {loading ? (
                <App.Flex height={60} align="center">
                  <App.Loader size={60} />
                </App.Flex>
              ) : (
                <App.Text size={60} weight={800} height={1}>{stats.created}</App.Text>
              )}

              <App.Flex center width={60} height={60}>
                <img src="/images/home/stats-3.png" alt="" className={styles.img} />
              </App.Flex>
            </App.Flex>

            <App.Flex row flex={1} gap={16}>
              <App.Flex column flex={7} gap={8} className={cn(styles.statsBox, styles.noPadding)}>
                <App.Flex column gap={12} className={styles.volumeBack}>
                  <App.Text size={24} weight={700}>7-Day <App.Text inline size={24} weight={700} italic family="Playfair Display">Trading</App.Text> Volume</App.Text>

                  {loading ? (
                    <App.Flex height={60} align="center">
                      <App.Loader size={60} />
                    </App.Flex>
                  ) : (
                    <App.Text size={60} weight={800} height={1}>${stats.volume}</App.Text>
                  )}
                </App.Flex>
              </App.Flex>

              <App.Flex column flex={3} center gap={12} className={styles.statsGradientBox}>
                <App.Flex center column>
                  <App.Text center size={24} weight={700} height={1}>Total Orders</App.Text>
                  <App.Text center size={24} weight={700} italic family="Playfair Display" height={1}>Cancelled</App.Text>
                </App.Flex>

                {loading ? (
                  <App.Flex height={48} align="center" justify="center">
                    <App.Loader size={48} />
                  </App.Flex>
                ) : (
                  <App.Text center size={48} weight={700} height={1}>{stats.cancelled}</App.Text>
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  ) : (
    <App.Container className={styles.container}>
      <App.Flex column gap={32}>
      <App.Text center size={[64, 48]} weight={700} height={1}>
          DEX with <App.Text inline italic size={[64, 48]} weight={700} height={1} family="Playfair Display" color="#A8DC43">Unmatched Gas Efficiency</App.Text><br />and <App.Text inline italic size={[64, 48]} weight={700} height={1} family="Playfair Display" color="#7364FF">Market Tools</App.Text>
        </App.Text>
        
        <App.Flex fullWidth column gap={16}>
          <App.Flex column center gap={12} className={styles.statsGradientBox}>
            <App.Flex center column>
              <App.Text center size={20} weight={700} height={1.2}>Total Trades Settled</App.Text>
              <App.Text center size={20} weight={700} italic family="Playfair Display">(On-chain)</App.Text>
            </App.Flex>
            
            {loading ? (
              <App.Flex height={48} align="center" justify="center">
                <App.Loader size={48} />
              </App.Flex>
            ) : (
              <App.Text size={48} weight={700} height={1}>{stats.settled}</App.Text>
            )}
          </App.Flex>

          <App.Flex row fullWidth gap={16}>
            <App.Flex flex={7} column gap={8} className={cn(styles.statsBox, styles.noPadding)}>
              <App.Flex column full gap={20} justify="flex-end" className={styles.gasBack}>
                <App.Text size={20} weight={700} height={1}>
                  Gas<br />
                  <App.Text inline size={20} weight={700} italic family="Playfair Display">Saved</App.Text>
                </App.Text>

                {loading ? (
                  <App.Flex height={28} align="center">
                    <App.Loader size={28} />
                  </App.Flex>
                ) : (
                  <App.Text size={28} weight={800} height={1}>${stats.gas}</App.Text>
                )}
              </App.Flex>
            </App.Flex>

            <App.Flex column flex={3} gap={12} fullWidth justify="space-between" sx={{ paddingBottom: 48 }} className={cn(styles.statsBox, styles.newGradient)}>
              <App.Flex column>
                <App.Text size={16} weight={700}>Total</App.Text>
                <App.Text size={16} weight={700}>Orders</App.Text>
                <App.Text size={16} weight={700} italic family="Playfair Display">Created</App.Text>
              </App.Flex>

              {loading ? (
                <App.Flex height={44} align="center">
                  <App.Loader size={44} />
                </App.Flex>
              ) : (
                <App.Text size={44} weight={800} height={1}>{stats.created}</App.Text>
              )}

              <App.Flex center width={48} height={48} sx={{ position: 'absolute', bottom: -8, right: -8 }}>
                <img src="/images/home/stats-3.png" alt="" className={styles.img} />
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex row fullWidth gap={16}>
            <App.Flex column flex={1} gap={8} className={cn(styles.statsBox, styles.noPadding)}>
              <App.Flex column gap={12} className={styles.volumeBack}>
                <App.Text size={20} weight={700}>
                  7-Day<br />
                  <App.Text inline size={20} weight={700} italic family="Playfair Display">Trading</App.Text><br />
                  Volume
                </App.Text>

                {loading ? (
                  <App.Flex height={40} align="center">
                    <App.Loader size={40} />
                  </App.Flex>
                ) : (
                  <App.Text size={40} weight={800} height={1}>${stats.volume}</App.Text>
                )}
              </App.Flex>
            </App.Flex>

            <App.Flex column flex={1} center gap={12} className={styles.statsGradientBox}>
              <App.Flex center column>
                <App.Text center size={20} weight={700} height={1}>Total Orders</App.Text>
                <App.Text center size={20} weight={700} italic family="Playfair Display" height={1}>Cancelled</App.Text>
              </App.Flex>

              {loading ? (
                <App.Flex height={40} align="center" justify="center">
                  <App.Loader size={40} />
                </App.Flex>
              ) : (
                <App.Text center size={40} weight={700} height={1}>{stats.cancelled}</App.Text>
              )}
            </App.Flex>
          </App.Flex>

          <App.Flex center>
            <App.Text center size={14} weight={400} color="#9B99AE" className={styles.bottomText}><a href="https://stats.tegro.com/?utm_source=home&utm_medium=tegro&utm_campaign=testnet" target="_blank" rel="noreferrer">View more stats &gt;</a></App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )

  return !isMobile ? (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }} className={styles.container}>
      <App.Flex row gap={16}>
        <App.Flex column width={484} gap={16}>
          <App.Flex column gap={16} className={styles.statsBox}>
            <App.Flex row align="center" justify="space-between">
              <App.Flex row center gap={8}>
                <App.Icon icon="wallet3" />
                <App.Text size={16} weight={700} height={1}>Daily Orders</App.Text>
              </App.Flex>

              <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>
            </App.Flex>

            <img src="/images/home/stats-1.png" alt="" className={styles.img} />
          </App.Flex>

          <App.Flex row gap={16}>
            <App.Flex column gap={16} width={283} className={styles.statsBox}>
              <App.Flex row align="center" gap={8}>
                <App.Icon icon="trades" />
                <App.Text size={16} weight={700} height={1}>On-Chain Settled Trades</App.Text>
              </App.Flex>

              <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>

              <img src="/images/home/stats-2.png" alt="" className={styles.img} />
            </App.Flex>

            <App.Flex column gap={16} flex={1}>
              <App.Flex column gap={8} className={styles.statsGradientBox}>
                <App.Flex row fullWidth align="center" justify="space-between">
                  <App.Flex column>
                    <App.Text size={16} weight={700}>Total Orders</App.Text>
                    <App.Text size={16} weight={700} italic family="Playfair Display">Created</App.Text>
                  </App.Flex>

                  <App.Flex center width={44} height={44}>
                    <img src="/images/home/stats-3.png" alt="" className={styles.img} />
                  </App.Flex>
                </App.Flex>

                {loading ? (
                  <App.Flex height={62} align="center">
                    <App.Loader size={44} />
                  </App.Flex>
                ) : (
                  <App.Text size={44} weight={800}>{stats.created}</App.Text>
                )}
              </App.Flex>

              <App.Flex flex={1} fullWidth className={styles.relative}>
                <App.Flex width={278} column gap={8} className={cn(styles.statsBox, styles.noPadding, styles.absolute, styles.left)}>
                  <App.Flex column full gap={29} justify="flex-end" className={styles.gasBack}>
                    <App.Flex column align="flex-end">
                      <App.Text right size={20} weight={700}>Gas</App.Text>
                      <App.Text size={20} weight={700} italic family="Playfair Display">Saved</App.Text>
                    </App.Flex>

                    {loading ? (
                      <App.Flex height={55} align="center" justify="flex-end">
                        <App.Loader size={39} />
                      </App.Flex>
                    ) : (
                      <App.Text right size={39} weight={800}>${stats.gas}</App.Text>
                    )}
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={283} gap={16}>
          <App.Flex column gap={14} fullWidth className={styles.statsBox}>
            <App.Flex row align="center" gap={8}>
              <App.Icon icon="shield" />
              <App.Text size={16} weight={700} height={1}>Daily Orders Cancelled</App.Text>
            </App.Flex>

            <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>

            <img src="/images/home/stats-5.png" alt="" className={styles.img} />
          </App.Flex>

          <App.Flex row fullWidth flex={1} gap={16}>
            <App.Flex width={78}></App.Flex>

            <App.Flex column center flex={1} gap={16} className={styles.statsGradientBox}>
              <App.Flex center column>
                <App.Text center size={20} weight={700} height={1.2}>Total Trades Settled</App.Text>
                <App.Text center size={20} weight={700} italic family="Playfair Display">(On-chain)</App.Text>
              </App.Flex>
              
              {loading ? (
                <App.Flex height={48} align="center" justify="center">
                  <App.Loader size={48} />
                </App.Flex>
              ) : (
                <App.Text size={48} weight={700} height={1}>{stats.settled}</App.Text>
              )}
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={383} gap={16}>
          <App.Flex row gap={16} fullWidth height={115}>
            <App.Flex width={175} className={styles.relative}>
              <App.Flex column gap={8} className={cn(styles.statsBox, styles.noPadding, styles.absolute, styles.bottom)}>
                <App.Flex column gap={24} height={286} className={styles.volumeBack}>
                  <App.Flex column align="flex-start">
                    <App.Text size={20} weight={700}>Total</App.Text>
                    <App.Text size={20} weight={700} italic family="Playfair Display">Trading</App.Text>
                    <App.Text size={20} weight={700}>Volume</App.Text>
                  </App.Flex>

                  {loading ? (
                    <App.Flex height={44} align="center" justify="flex-end">
                      <App.Loader size={44} />
                    </App.Flex>
                  ) : (
                    <App.Text size={44} weight={800} height={1}>${stats.volume}</App.Text>
                  )}
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} className={styles.relative}>
              <App.Flex column center gap={12} height={180} className={cn(styles.statsGradientBox, styles.absolute, styles.bottom)}>
                <App.Flex center column>
                  <App.Text center size={20} weight={700} height={1.2}>Total Orders</App.Text>
                  <App.Text center size={20} weight={700} italic family="Playfair Display">Cancelled</App.Text>
                </App.Flex>

                {loading ? (
                  <App.Flex height={48} align="center" justify="center">
                    <App.Loader size={48} />
                  </App.Flex>
                ) : (
                  <App.Text center size={48} weight={700} height={1}>{stats.cancelled}</App.Text>
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={14} flex={1} fullWidth className={styles.statsBox}>
            <App.Flex row align="center" gap={8}>
              <App.Icon icon="volume" />
              <App.Text size={16} weight={700} height={1}>Daily Trade Volume</App.Text>
            </App.Flex>

            <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>

            <img src="/images/home/stats-6.png" alt="" className={styles.img} />
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex sx={{ paddingTop: 16 }}>
        <App.Text size={14} weight={400} color="#9B99AE" className={styles.bottomText}>Interested in More Statistics? <a href="https://stats.tegro.com/?utm_source=home&utm_medium=tegro&utm_campaign=testnet" target="_blank" rel="noreferrer">View More Stats &gt;</a></App.Text>
      </App.Flex>
    </App.Container>
  ) : (
    <App.Container className={styles.container}>
      <App.Flex column fullWidth gap={16}>
        <App.Flex row gap={16}>
          <App.Flex flex={6} column gap={8} className={cn(styles.statsBox, styles.noPadding)}>
            <App.Flex column full gap={29} justify="flex-end" className={styles.gasBack}>
              <App.Flex column align="flex-end">
                <App.Text right size={20} weight={700}>Gas</App.Text>
                <App.Text size={20} weight={700} italic family="Playfair Display">Saved</App.Text>
              </App.Flex>

              {loading ? (
                <App.Flex height={40} align="center" justify="flex-end">
                  <App.Loader size={28} />
                </App.Flex>
              ) : (
                <App.Text right size={28} weight={800}>{stats.gas}</App.Text>
              )}
            </App.Flex>
          </App.Flex>

          <App.Flex flex={4} column gap={8} className={styles.statsGradientBox} sx={{ padding: '24px 16px' }}>
            <App.Flex column>
              <App.Text size={16} weight={700}>Total</App.Text>
              <App.Text size={16} weight={700}>Orders</App.Text>
              <App.Text size={16} weight={700} italic family="Playfair Display">Created</App.Text>
            </App.Flex>

            {loading ? (
              <App.Flex height={62} align="center" justify="flex-end">
                <App.Loader size={44} />
              </App.Flex>
            ) : (
              <App.Text size={44} weight={800}>{stats.created}</App.Text>
            )}
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.statsBox}>
          <App.Flex row align="center" justify="space-between">
            <App.Flex row center gap={8}>
              <App.Icon icon="wallet3" />
              <App.Text size={16} weight={700} height={1}>Daily Orders</App.Text>
            </App.Flex>

            <App.Text size={12} weight={500} color="#9B99AE">{date}</App.Text>
          </App.Flex>

          <img src="/images/home/stats-1.png" alt="" className={styles.img} />
        </App.Flex>

        <App.Flex column gap={14} fullWidth className={styles.statsBox}>
          <App.Flex row align="center" gap={8}>
            <App.Icon icon="shield" />
            <App.Text size={16} weight={700} height={1}>Daily Orders Cancelled</App.Text>
          </App.Flex>

          <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>

          <img src="/images/home/stats-5.png" alt="" className={styles.img} />
        </App.Flex>

        <App.Flex column center fullWidth gap={16} className={styles.statsGradientBox}>
          <App.Flex center column>
            <App.Text center size={20} weight={700} height={1.2}>Total Trades Settled</App.Text>
            <App.Text center size={20} weight={700} italic family="Playfair Display">(On-chain)</App.Text>
          </App.Flex>

          {loading ? (
            <App.Flex height={48} align="center" justify="center">
              <App.Loader size={48} />
            </App.Flex>
          ) : (
            <App.Text size={48} weight={700} height={1}>{stats.settled}</App.Text>
          )}
        </App.Flex>

        <App.Flex column gap={16} fullWidth className={styles.statsBox}>
          <App.Flex row align="center" gap={8}>
            <App.Icon icon="trades" />
            <App.Text size={16} weight={700} height={1}>On-Chain Settled Trades</App.Text>
          </App.Flex>

          <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>

          <img src="/images/home/stats-2.png" alt="" className={styles.img} />
        </App.Flex>

        <App.Flex row gap={16}>
          <App.Flex column flex={1} gap={8} className={cn(styles.statsBox, styles.noPadding)}>
            <App.Flex column gap={24} height={286} className={styles.volumeBack}>
              <App.Flex column align="flex-start">
                <App.Text size={20} weight={700}>Total</App.Text>
                <App.Text size={20} weight={700} italic family="Playfair Display">Trading</App.Text>
                <App.Text size={20} weight={700}>Volume</App.Text>
              </App.Flex>

              {loading ? (
                <App.Flex height={44} align="center">
                  <App.Loader size={44} />
                </App.Flex>
              ) : (
                <App.Text size={44} weight={800} height={1}>{stats.volume}</App.Text>
              )}
            </App.Flex>
          </App.Flex>

          <App.Flex column center gap={12} flex={1} className={cn(styles.statsGradientBox)}>
            <App.Flex center column>
              <App.Text center size={20} weight={700} height={1.2}>Total Orders</App.Text>
              <App.Text center size={20} weight={700} italic family="Playfair Display">Cancelled</App.Text>
            </App.Flex>

            {loading ? (
              <App.Flex height={48} align="center" justify="center">
                <App.Loader size={48} />
              </App.Flex>
            ) : (
              <App.Text center size={48} weight={700} height={1}>{stats.cancelled}</App.Text>
            )}
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={14} fullWidth className={styles.statsBox}>
          <App.Flex row align="center" gap={8}>
            <App.Icon icon="volume" />
            <App.Text size={16} weight={700} height={1}>Daily Trade Volume</App.Text>
          </App.Flex>

          <App.Text size={12} weight={500} color="#9B99AE">Created at {date}</App.Text>

          <img src="/images/home/stats-6.png" alt="" className={styles.img} />
        </App.Flex>
      </App.Flex>

      <App.Flex center sx={{ paddingTop: 16 }}>
        <App.Text center size={14} weight={400} color="#9B99AE" className={styles.bottomText}>Interested in More Statistics? <a href="https://stats.tegro.com/?utm_source=home&utm_medium=tegro&utm_campaign=testnet" target="_blank" rel="noreferrer">View More Stats &gt;</a></App.Text>
      </App.Flex>
    </App.Container>
  )
}

export default HomeStats