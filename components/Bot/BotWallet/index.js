import styles from './styles.module.scss'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

const BotWallet = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector(({ $bot }) => $bot.user)

  const [showDropdown, setShowDropdown] = useState(false)

  const handleConnect = async () => {
    const hashRes = await $bot.api.generateWalletHash()
    const hash = hashRes?.hash || ''

    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro website to connect Base wallet', [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (response) => {
      if (response.button_id === 'ok' && hash) {
        TelegramBot.openLink(`https://beta.tegro.com/bot/wallet?hash=${hash}`)
      }
    })
  }

  const getShort = (address) => {
    const n = 4
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  const handleDisconnect = async () => {
    const result = await $bot.api.unassign()
    
    if (result) {
      dispatch($bot.set.user(result))
    }
  }

  const handleCopyToClipboard = () => {

  }

  return (
    <App.Flex column align="center" gap={8}>
      <App.Flex row align="center" gap={8}>
        {
          user?.user
            ? <App.Flex gap={8} className={styles.walletButtonContainer}>
                <App.Button variant="bot-default" small onClick={() => setShowDropdown(!showDropdown)}>
                  <App.Icon icon="logo-tiger-head" width={16} height={16} />
                  <App.Text>{ getShort(user.user.wallet_address) }</App.Text>
                </App.Button>

                <App.Flex className={cn(styles.dropdownMenu, {[styles.isOpen]: showDropdown})}>
                  <App.Flex className={styles.menuItem} onClick={handleCopyToClipboard}>
                    <App.Icon icon="copy2" color="#B9B8C5" width={14} height={14} />
                    <App.Text size={12}>Copy Address</App.Text>
                  </App.Flex>

                  <App.Flex className={styles.menuItem} onClick={handleDisconnect}>
                    <App.Icon icon="logout2" color="#B9B8C5" width={12} height={12} />
                    <App.Text size={12}>Disconnect</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            : <App.Button variant="bot" small onClick={handleConnect}><App.Icon icon="wallet-bot" /> Connect Wallet</App.Button>
        }
      </App.Flex>
    </App.Flex>
  )
}

export default BotWallet