import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotShop = () => {
  const dispatch = useDispatch()
  const products = useSelector($bot.get.activeProducts)
  const invoices = useSelector(({ $bot }) => $bot.invoices)
  const offer = useSelector($bot.get.offer)
  const user = useSelector(({ $bot }) => $bot.user)

  const [loading, setLoading] = useState(false)

  const handlePay = (item) => async () => {
    if (loading) {
      return
    }

    let invoice = invoices.find(el => el.id === item.id)?.invoice

    if (!invoice) {
      setLoading(true)

      const payload = {
        title: `${item.gems} gems`,
        description: `${item.gems} gems for bidding`,
        payload: `product_id=${item.id}`,
        provider_token: '',
        currency: 'XTR',
        prices: [
          { label: 'Price', amount: item.price },
        ],
      }

      const result = await $bot.api.invoice(payload)
      if (!result?.error) {
        invoice = result
      }

      setLoading(false)
    }

    if (invoice) {
      Amplitude.event(`Buy Gems`, {
        'Page': 'Shop',
        'Source': 'Telegram',
        'Amount': item.gems,
      })

      TelegramBot.openInvoice(invoice, handleInvoice)
    }
  }

  const handleInvoice = async (status) => {
    if (status == 'paid' || status == 'pending') {
      fetchUser()
    }
  }

  const fetchUser = async () => {
    const result = await $bot.api.user({referral_code: ''})
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    }
  }

  const handleOffer = async () => {

  }

  return (
    <App.Flex column fullWidth center gap={32} className={styles.container}>
      {offer ? (
        <App.Flex column fullWidth gap={16}>
          <App.Flex center className={styles.title}>
            <Image src="/images/bot/shop-title-1.png" width={213} height={43} alt="" />

            <App.Flex center className={styles.text}>
              <App.Text size={16} weight={700} height={1} color="#FFBB01">Offers</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column fullWidth gap={4} className={styles.offer} onClick={handlePay(offer)}>
            {user.product_ids.includes(offer.id) ? (
              <App.Flex row center gap={4} className={cn(styles.header, styles.small)}>
                <App.Icon icon="check-circle-fill" width={20} height={20} secondaryColor={'transparent'} />
                <App.Text size={16} weight={700} color="#FFBB01" sx={{ textShadow: '0px 1.484px 9.063px rgba(182, 0, 0, 0.55), 0px 1px 3px rgba(0, 0, 0, 0.25)' }}>Purchased!</App.Text>
              </App.Flex>
            ) : (
              <App.Flex row align="center" justify="space-between" className={styles.header}>
                <App.Flex row align="center" width="45%">
                  <App.Text size={16} weight={700} color="#FFBB01" sx={{ textShadow: '0px 1.484px 9.063px rgba(182, 0, 0, 0.55), 0px 1px 3px rgba(0, 0, 0, 0.25)' }}>First Purchase Discount</App.Text>
                </App.Flex>

                <App.Flex row align="center" justify="flex-end" width="45%">
                  <App.Text right size={28} weight={800} color="#FFBB01" sx={{ textShadow: '0px 1.484px 9.063px rgba(182, 0, 0, 0.55), 0px 1px 3px rgba(0, 0, 0, 0.25)' }}>{offer.discount}</App.Text>
                </App.Flex>
              </App.Flex>
            )}

            <App.Flex row justify="space-between" align="center">
              <App.Flex column align="center" width={user.product_ids.includes(offer.id) ? '100%' : '40%'} gap={4}>
                <Image src={`/images/bot/${offer.image}`} width={76} height={76} alt="" />

                <App.Text center size={13} weight={800} height={1}>{offer.gems} gems</App.Text>
              </App.Flex>

              {!user.product_ids.includes(offer.id) ? (
                <App.Flex column justify="center" align="flex-start" width="40%" gap={8} sx={{ paddingTop: 8 }}>
                  <App.Text size={14} weight={700} height={1} sx={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)' }}>{offer.title}</App.Text>
                  <App.Flex row align="center">
                    <App.Flex row align="center" gap={4}>
                      <App.Text lineThrough size={20} weight={700} height={1}>{offer.priceOld}</App.Text>
                      <App.Text size={20} weight={800} height={1}>{offer.price}</App.Text>
                    </App.Flex>

                    {offer.currency == 'XTR' ? (
                      <Image src="/images/bot/star.png" width={23} height={22} alt="" />
                    ) : (
                      <App.Text size={20} weight={800} height={1}>{offer.currency}</App.Text>
                    )}
                  </App.Flex>

                  <App.Button variant="bot" small>Buy Now</App.Button>
                </App.Flex>
              ) : null}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      ) : null}

      {products.length ? (
        <App.Flex column fullWidth gap={16}>
          <App.Flex center className={styles.title}>
            <Image src="/images/bot/shop-title-2.png" width={358} height={43} alt="" />

            <App.Flex center className={styles.text}>
              <App.Text size={16} weight={700} height={1} color="#FFBB01">Gems</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column fullWidth gap={16} className={styles.gems}>
            {products.map((item, index) => {
              return (
                <App.Flex key={index} fullWidth className={cn(styles.box, styles[item.className])} onClick={handlePay(item)}>
                  <App.Flex fullWidth className={styles.inner}>
                    <App.Flex row fullWidth justify="space-between" align="center">
                      <App.Flex column align="center" width="40%" gap={4}>
                        <Image src={`/images/bot/${item.image}`} width={76} height={76} alt="" />

                        <App.Text center size={13} weight={800} height={1}>{item.gems} gems</App.Text>
                      </App.Flex>

                      <App.Flex column justify="center" align="flex-start" width="50%" gap={16} sx={{ paddingTop: 8 }}>
                        <App.Flex column fullWidth gap={8}>
                          <App.Text size={14} weight={700} height={1} sx={{ textShadow: '0px 1px 3px rgba(0, 0, 0, 0.25)' }}>{item.title}</App.Text>
                          <App.Flex row align="center">
                            <App.Text size={20} weight={800} height={1}>{item.price}</App.Text>
                            {item.currency == 'XTR' ? (
                              <Image src="/images/bot/star.png" width={23} height={22} alt="" />
                            ) : (
                              <App.Text size={20} weight={800} height={1}>{item.currency}</App.Text>
                            )}
                            <App.Text size={14} weight={400} height={1}>{item.discount != '' ? `(${item.discount})` : ''}</App.Text>
                          </App.Flex>
                        </App.Flex>

                        <App.Button variant="bot" small>Buy Now</App.Button>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              )
            })}
          </App.Flex>
        </App.Flex>
      ) : null}
    </App.Flex>
  )
}

export default BotShop