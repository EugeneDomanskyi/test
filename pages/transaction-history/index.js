import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'
import Image from 'next/image'

const TransactionHistory = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const transactions = useSelector(({ $gem }) => $gem.transactions)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('received')

  const tabs = [
    { title: t(`Gems Received`), key: 'received' },
    { title: t(`Gems Spent`), key: 'spent' },
  ]

  useEffect(() => {
    if (wallet) {
      fetchTransactions()
    }
  }, [wallet])

  const fetchTransactions = async () => {
    const result = await $gem.api.transactions(wallet, {})
    if (result) {
      dispatch($gem.set.transactions(result))
    }
    setLoading(false)
  }

  const handleTab = (value) => {
    setTab(value)
  }

  const handleBack = () => {
    router.push(`/gems-dashboard`)
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
        <App.Flex column gap={32}>
          <App.Flex fullWidth row align="center">
            <App.Flex row sx={{ cursor: 'pointer' }} onClick={handleBack}>
              <App.Text weight={600}>&lt; Back</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column>
            <App.Tabs active={tab} options={tabs} variant="gems" onChange={handleTab} />

            <App.Flex column>
              <App.Flex row>
                <App.Flex className={styles.gradient} sx={[{ marginRight: 24 }, {marginRight: 8}]} />

                <App.Flex width={[140, 80]} align="center">
                  {tab == 'received' ? (
                    <App.Text left weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
                  ) : (
                    <App.Text left weight={600} height={1} color="#A6DC37">{t(isMobile ? 'Date' : 'Last Bid Date')}</App.Text>
                  )}
                </App.Flex>

                <App.Flex width={[300, 'auto']} flex={[null, 1]} align="center">
                  {tab == 'received' ? (
                    <App.Text weight={600} height={1} color="#A6DC37">{t(`Earn`)}</App.Text>
                  ) : (
                    <App.Text weight={600} height={1} color="#A6DC37">{t(`Auction`)}</App.Text>
                  )}
                </App.Flex>
                
                {!isMobile ? (
                  tab == 'received' ? (
                    <App.Flex flex={1} align="center">
                      <App.Text weight={600} height={1} color="#A6DC37">{t(`Reason`)}</App.Text>
                    </App.Flex>
                  ) : (
                    <App.Flex flex={1} center>
                      <App.Text center weight={600} height={1} color="#A6DC37">{t(`ID`)}</App.Text>
                    </App.Flex>
                  )
                ) : null}

                <App.Flex width={[200, 90]} align="center" justify="flex-end">
                  <App.Text right weight={600} height={1} color="#A6DC37">{t(`Gems`)}</App.Text>
                </App.Flex>

                <App.Flex className={styles.gradient} sx={[{ marginLeft: 24 }, { marginLeft: 8 }]} />
              </App.Flex>

              <App.Flex column className={styles.table}>
                {loading ? (
                  <App.LoaderBlock height={300} />
                ) : (
                  transactions.length > 0 ? (
                    transactions.map((item, index) => {
                      const [topic, ...rest] = item.reason.split('_')
                      const reason = rest.join(' ')
                      return (
                        <App.Flex key={index} row className={styles.row}>
                          <App.Flex width={[140, 80]} align="center">
                            <App.Text size={[16, 12]} weight={[600, 400]}>{moment(item.created_at).format('DD-MM-YYYY')}<br />{moment(item.created_at).format('hh:mm:ss A')}</App.Text>
                          </App.Flex>

                          {tab == 'received' ? (
                            <App.Flex gap={16} width={[300, 'auto']} flex={[null, 1]} align="center">
                              {isMobile ? (
                                <App.Flex column>
                                  <App.Text capitalize size={14} weight={600} height={1}>{topic}</App.Text>
                                  <App.Text capitalize size={14} weight={400} height={1}>{reason}</App.Text>
                                </App.Flex>
                              ) : (
                                <>
                                <App.Flex center className={styles.cupBox}>
                                  <App.Icon icon="cup" />
                                </App.Flex>
                                <App.Text capitalize size={[16, 14]} weight={[600, 400]} height={1}>{topic}</App.Text>
                                </>
                              )}
                            </App.Flex>
                          ) : (
                            <App.Flex gap={[16, 8]} width={[300, 'auto']} flex={[null, 1]} align="center">
                              <Image src="/images/bid-image-small.png" width={isMobile ? 24 : 50} height={isMobile ? 24 : 50} alt="" />
                              <App.Flex column gap={8}>
                                <App.Text capitalize size={[16, 14]} weight={[600, 400]} height={1}>Elemental #9045</App.Text>
                                {isMobile ? (
                                  <App.Text capitalize size={12} weight={400} height={1} color="#FFFFFF99">ID: 1231247745</App.Text>
                                ) : null}
                              </App.Flex>
                            </App.Flex>
                          )}

                          {!isMobile ? (
                            tab == 'received' ? (
                              <App.Flex flex={1} align="center">
                                <App.Text capitalize size={[16, 14]} weight={[600, 400]} height={1}>{reason}</App.Text>
                              </App.Flex>
                            ) : (
                              <App.Flex flex={1} center>
                                <App.Text capitalize size={[16, 14]} weight={[600, 400]} height={1}>1231247745</App.Text>
                              </App.Flex>
                            )
                          ) : null}

                          <App.Flex width={[200, 90]} align="center" justify="flex-end">
                            {tab == 'received' ? (
                              <App.Text right size={[16, 14]} weight={[600, 400]} height={1} color="#53F19C">+ {item.points} {t('Gems')}</App.Text>
                            ) : (
                              <App.Text right size={[16, 14]} weight={[600, 400]} height={1} color="#FF1D61">- {item.points} {t('Gems')}</App.Text>
                            )}
                          </App.Flex>
                        </App.Flex>
                      )
                    })
                  ) : (
                    <App.Flex center height={200}>
                      <App.Text>{t('There is no data yet')}</App.Text>
                    </App.Flex>
                  )
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default TransactionHistory