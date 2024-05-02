import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import moment from 'moment'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsLiquidityOrders = ({ loading }) => {
  const { t } = useTranslation()

  const blockchain = useSelector($app.get.blockchain)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const chains = useSelector(({ $app }) => $app.chains)
  const liquidity = useSelector(({ $point }) => $point.liquidity)

  const [tab, setTab] = useState('open')
  const [currentOrder, setCurrentOrder] = useState()

  const tabs = [
    { title: t('Open Orders'), key: 'open' },
    { title: t('Completed Orders'), key: 'completed' },
  ]

  const handleTab = (value) => {
    setTab(value)
  }

  const handleMore = (item) => () => {
    setCurrentOrder(item)
  }

  const handleDialogClose = () => {
    setCurrentOrder(null)
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Your Stats')}</App.Text>

      <App.Flex column>
        <App.Tabs active={tab} options={tabs} variant="points" onChange={handleTab} />

        <App.Flex row>
          <App.Flex className={styles.gradient} />

          {!isMobile ? (
            <>
              <App.Flex width={220} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
              </App.Flex>

              <App.Flex width={180} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Market')}</App.Text>
              </App.Flex>

              <App.Flex flex={1} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Order Size')}</App.Text>
              </App.Flex>

              <App.Flex flex={1} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Price')}</App.Text>
              </App.Flex>

              <App.Flex flex={1} row gap={4} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Price Deviation')}</App.Text>
                <App.Icon icon="warning-circle" />
              </App.Flex>

              <App.Flex flex={1} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Point Per Minute')}</App.Text>
              </App.Flex>

              <App.Flex flex={1} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Total Points Earned')}</App.Text>
              </App.Flex>
            </>
          ) : (
            <>
              <App.Flex width={80} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
              </App.Flex>

              <App.Flex width={128} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Market')}</App.Text>
              </App.Flex>

              <App.Flex flex={1} center>
                <App.Text center weight={600} height={1} color="#A6DC37">{t('Points')}</App.Text>
              </App.Flex>

              <App.Flex width={44} center>
              </App.Flex>
            </>
          )}

          <App.Flex className={styles.gradient} />
        </App.Flex>

        <App.Flex column className={styles.table}>
          {loading ? (
            <App.LoaderBlock height={200} />
          ) : (
            liquidity[tab].length ? (
              !isMobile ? (
                liquidity[tab].map((item, index) => {
                  const chainCode = chains.find(chain => chain.id == item.market.chain_id)?.code ?? blockchain.code
                  return (
                    <App.Flex key={index} row className={styles.row}>
                      <App.Flex width={220} center>
                        <App.Text center weight={600} height={1.4}>{moment(item.date).format('DD-MM-YYYY')}<br />{moment(item.date).format('hh:mm:ss A Z')}</App.Text>
                      </App.Flex>

                      <App.Flex width={180} column gap={4} center>
                        <App.Flex row center gap={6}>
                          <App.Flex center sx={{ position: 'relative' }}>
                            <Image src={item.market.image} width={24} height={24} alt="" />
                            <App.Flex center sx={{ position: 'absolute', top: 0, left: -6, }}>
                              <Image src={`/images/icon-${chainCode}.png`} width={12} height={12} alt="" />
                            </App.Flex>
                          </App.Flex>
                          <App.Text center size={16} weight={600} height={1}>{item.market.name}</App.Text>
                        </App.Flex>

                        <App.Text center size={10} weight={400} height={1} color="#FFFFFF99">Mid price - {item.market.middle_price} USDT</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} column center>
                        <App.Text center size={16} weight={600} height={1}>{item.order_size} USDT</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} center>
                        <App.Text center size={16} weight={600} height={1}>{item.price} USDT</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} center>
                        <App.Text center size={16} weight={600} height={1}>{Math.abs(item.price_deviation)}%</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} center>
                        <App.Text center size={16} weight={600} height={1}>{item.points_per_minute}</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} center>
                        <App.Text center size={16} weight={600} height={1}>{item.points}</App.Text>
                      </App.Flex>
                    </App.Flex>
                )})
              ) : (
                liquidity[tab].map((item, index) => {
                  const chainCode = chains.find(chain => chain.id == item.market.chain_id)?.code ?? blockchain.code
                  return (
                    <App.Flex key={index} row className={styles.row}>
                      <App.Flex width={80} center>
                        <App.Text center size={14} weight={[600, 400]}>{moment(item.date).format('DD.MM.YY')}<br />{moment(item.date).format('hh:mm:ss')}</App.Text>
                      </App.Flex>

                      <App.Flex width={128} column gap={4} center>
                        <App.Flex row center gap={6}>
                          <App.Flex center sx={{ position: 'relative' }}>
                            <Image src={item.market.image} width={24} height={24} alt="" />
                            <App.Flex center sx={{ position: 'absolute', top: 0, left: -6, }}>
                              <Image src={`/images/icon-${chainCode}.png`} width={12} height={12} alt="" />
                            </App.Flex>
                          </App.Flex>
                          <App.Text center size={[16, 14]} weight={600} height={1}>{item.market.name}</App.Text>
                        </App.Flex>

                        <App.Text center size={10} weight={400} height={1} color="#FFFFFF99">Mid price - {item.market.middle_price} USDT</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} center>
                        <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>{item.points}</App.Text>
                      </App.Flex>

                      <App.Flex width={44} center>
                        <App.Flex center className={styles.more} onClick={handleMore(item)}>
                          <App.Icon icon="arrow-45" />
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                )})
              )
            ) : (
              <App.Flex center height={200}>
                <App.Text>{t('There is no data yet')}</App.Text>
              </App.Flex>
            )
          )}
        </App.Flex>
      </App.Flex>

      <App.Dialog open={currentOrder} onClose={handleDialogClose} title={currentOrder?.market?.name}>
        {currentOrder ? (
          <App.Flex column sx={{ padding: 16 }} gap={8}>
            <App.Flex row align="center" justify="space-between">
              <App.Text size={14} weight={400} height={1}>{t('Date')}</App.Text>
              <App.Text size={14} weight={600} height={1}>{moment(currentOrder.date).format('DD-MM-YYYY hh:mm:ss A Z')}</App.Text>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Text size={14} weight={400} height={1}>{t('Order Size')}</App.Text>
              <App.Text size={14} weight={600} height={1}>{currentOrder.order_size} USDT</App.Text>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Text size={14} weight={400} height={1}>{t('Price')}</App.Text>
              <App.Text size={14} weight={600} height={1}>{currentOrder.price} USDT</App.Text>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Text size={14} weight={400} height={1}>{t('Price Deviation')}</App.Text>
              <App.Text size={14} weight={600} height={1}>{Math.abs(currentOrder.price_deviation)}%</App.Text>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Text size={14} weight={400} height={1}>{t('Point Per Minute')}</App.Text>
              <App.Text size={14} weight={600} height={1}>{currentOrder.points_per_minute}</App.Text>
            </App.Flex>

            <App.Flex row align="center" justify="space-between">
              <App.Text size={14} weight={400} height={1}>{t('Total Points Earned')}</App.Text>
              <App.Text size={14} weight={600} height={1}>{currentOrder.points}</App.Text>
            </App.Flex>
          </App.Flex>
        ) : null}
      </App.Dialog>
    </App.Flex>
  )
}

export default PointsLiquidityOrders