import { useEffect, useState } from 'react'
import Script from 'next/script'
import crypto from 'crypto'

import App from '@/components/App'

import styles from './styles.module.scss'

const Bot  = () => {
  const [initData, setInitData] = useState(null)
  const [isBot, setIsBot] = useState(null)

  useEffect(() => {
    if (initData) {
      validateTelegramInitData()
    }
  }, [initData])

  const handleScriptLoaded = () => {
    if (typeof window !== 'undefined' && window?.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.setHeaderColor('#08051C')
      window.Telegram.WebApp.disableVerticalSwipes()

      if (window.Telegram.WebApp.initData !== '') {
        setInitData(window.Telegram.WebApp.initData)
        return
      }
    }
    
    setIsBot(false)
  }

  const validateTelegramInitData = () => {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    const authData = [...params.entries()]
      .filter(([key]) => key !== 'hash')
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN).digest()
    const generatedHash = crypto.createHmac('sha256', secretKey).update(authData).digest('hex')
    setIsBot(generatedHash === hash)
  }

  const handlePay = async () => {
    window.Telegram.WebApp.openInvoice('https://t.me/$jN1TNx0SOEqaCQAABRtX8jVLCEA', (status) => {
      alert(status)
    })
    // const payload = {
    //   title: 'Your Product Name',
    //   description: 'Description of the product',
    //   payload: 'buy-gems',
    //   provider_token: '',
    //   currency: 'XTR',
    //   prices: [
    //     { label: 'Price', amount: 10 },
    //   ],
    // };

    // try {
    //   const response = await fetch('https://c129-5-1-6-229.ngrok-free.app/generate-invoice', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload),
    //   });
    //   // alert(response.status)
    //   // if (response.ok) {
    //   //   alert('Invoice sent! Please check your Telegram chat.');
    //   // } else {
    //   //   alert('Failed to send the invoice.');
    //   // }
    // } catch (error) {
    //   console.error('Error sending invoice:', error);
    //   alert(error);
    // }
  }

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      
      {isBot !== null ? (
        isBot ? (
          <App.Flex center height={300}>
            <App.Text>Welcome</App.Text>

            <App.Button onClick={handlePay}>Buy Gems</App.Button>
          </App.Flex>
        ) : (
          <App.Flex center height={300}>
            <App.Text>Is not a bot</App.Text>
          </App.Flex>
        )
      ) : (
        <App.Flex center height={300}>
          <App.Text>Loading...</App.Text>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default Bot