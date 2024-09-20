import styles from './styles.module.scss'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'

const BotWallet = () => {
  const dispatch = useDispatch()

  const user = useSelector(({ $bot }) => $bot.user)

  const [showDropdown, setShowDropdown] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleConnect = async () => {
    const hashRes = await $bot.api.generateWalletHash()
    const hash = hashRes?.hash || ''

    TelegramBot.showPopup('Connect Wallet', `You will be redirect to Tegro website to connect Base wallet`, [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (response) => {
      if (response.button_id === 'ok' && hash) {
        TelegramBot.openLink(`https://${TelegramBot.host()}/bot/wallet?hash=${hash}`)
      }
    })
  }

  const getShort = (address) => {
    const n = 4
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  const handleDisconnect = async () => {
    const result = await $bot.api.unassign()
    if (result && !result.error) {
      dispatch($bot.set.user(result))
      setShowDropdown(false)
    }
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(user.user.wallet_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClickOutside = (event) => {
    const container = document.querySelector(`.${styles.walletButtonContainer}`)
    if (container && !container.contains(event.target)) {
      setShowDropdown(false)
    }
  }

  const handleCopyInitData = () => {
    navigator.clipboard.writeText(JSON.stringify(TelegramBot.getInitData(), null, 2))
    dispatch($alert.set.success({ title: 'initalData copied to clipboard'}))
  }

  return (
    <App.Flex column align="center" gap={8}>
      <App.Flex row align="center" gap={8}>
        {user?.user ? (
          <App.Flex gap={8} className={styles.walletButtonContainer}>
            <App.Button variant="bot-default" small onClick={() => setShowDropdown(!showDropdown)}>
              <App.Icon icon="logo-tiger-head" width={16} height={16} />
              <App.Text>{ getShort(user.user.wallet_address) }</App.Text>
            </App.Button>

            <App.Flex className={cn(styles.dropdownMenu, {[styles.isOpen]: showDropdown})}>
              <App.Flex className={styles.menuItem} onClick={handleCopyToClipboard}>
                <App.Icon icon="copy2" color="#B9B8C5" width={14} height={14} />
                <App.Text size={12}>{copied ? 'Copied' : 'Copy Wallet Address'}</App.Text>
              </App.Flex>

              {/* {TelegramBot.host() != 'tegro.com' ? (
                <App.Flex className={styles.menuItem} onClick={handleDisconnect}>
                  <App.Icon icon="logout2" color="#B9B8C5" width={12} height={12} />
                  <App.Text size={12}>Logout</App.Text>
                </App.Flex>
              ) : null} */}

              <App.Flex className={styles.menuItem} onClick={handleDisconnect}>
                  <App.Icon icon="logout2" color="#B9B8C5" width={12} height={12} />
                  <App.Text size={12}>Logout</App.Text>
                </App.Flex>
            </App.Flex>
          </App.Flex>
        ) : (
          <App.Button variant="bot" small outlined onClick={handleConnect}><App.Icon icon="wallet-bot" /> Connect Wallet</App.Button>
        )}

        {TelegramBot.host() != 'tegro.com' ? (
          <App.Button variant="bot-default" small onClick={handleCopyInitData}>Copy initData</App.Button>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default BotWallet