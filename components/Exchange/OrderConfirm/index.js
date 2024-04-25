import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { formatUnits, parseUnits } from 'viem'
import numeral from 'numeral'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import Contracts from '@/libs/contracts.lib'
import useApp from '@/myhooks/useApp'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const OrderConfirm = ({ side, blockchain, current, price, amount, total, version, onBack, onClose }) => {
  const { wallet, walletClient } = useWalletConnect()
  const { isApp, appLog } = useApp()

  const dispatch = useDispatch()

  const [step, setStep] = useState('preview')

  const contracts = new Contracts()

  const handleNextStep = async () => {
    if (step == 'preview') {
      Amplitude.event('Confirm Order Submit', {
        'Base Currency': side === 'buy' ? current.symbol : current.quoteSymbol,
        'Quote Currency': side === 'buy' ? current.quoteSymbol : current.symbol,
        'Side': side.toUpperCase(),
        'Quantity': numeral(amount).format('0.[00000]'),
        'Price': numeral(price).format('0.[00000]'),
        'Total': numeral(total).format('0.[00000]'),
        'Network': blockchain.code.toUpperCase(),
        'Order Type': 'Limit',
        'Step': 'Confirm',
      })

      setStep('sign')
      appLog('Check Allowance')
      const spendToken = side === 'buy' ? current.quote : current.address
      const allowance = await contracts.allowance(wallet, spendToken, blockchain?.contract?.exchange)
      if (allowance?.error) {
        console.log(1, allowance?.error)
        return handleError('Trade not approved', `Your trade for ${numeral(amount).format('0.[00000]')} ${current.symbol} was not successful. Please check the spending cap in your wallet.`)
      }

      appLog('Check Allowance Amount')
      const spendDecimals = side === 'buy' ? current.quoteDecimals : current.decimals
      const allowanceAmount = formatUnits(allowance, spendDecimals)
      if (allowanceAmount * 1 < amount * 1) {
        appLog('Change Allowance Amount')
        if (spendToken === '0xdac17f958d2ee523a2206206994597c13d831ec7') {
          const reset = await contracts.approve(spendToken, blockchain?.contract?.exchange, parseUnits('0', spendDecimals))
          if (reset?.error) {
            console.log(2, reset?.error)
            return handleError('Trade not approved', `Your trade for ${numeral(amount).format('0.[00000]')} ${current.symbol} was not successful. Please check the spending cap in your wallet.`)
          }
        }

        const approve = await contracts.approve(spendToken, blockchain?.contract?.exchange, parseUnits(Number.MAX_SAFE_INTEGER.toString(), spendDecimals))
        if (approve?.error) {
          console.log(3, approve?.error)
          return handleError('Trade not approved', `Your trade for ${numeral(amount).format('0.[00000]')} ${current.symbol} was not successful. Please check the spending cap in your wallet.`)
        }
      }

      setStep('place')

      Amplitude.event('Confirm Order Submit', {
        'Base Currency': side === 'buy' ? current.symbol : current.quoteSymbol,
        'Quote Currency': side === 'buy' ? current.quoteSymbol : current.symbol,
        'Side': side.toUpperCase(),
        'Quantity': numeral(amount).format('0.[00000]'),
        'Price': numeral(price).format('0.[00000]'),
        'Total': numeral(total).format('0.[00000]'),
        'Network': blockchain.code.toUpperCase(),
        'Order Type': 'Limit',
        'Step': 'Sign',
      })

      appLog('Generate Typed Data')
      const typedData = await $orders.api.typedData({
        chain_id: blockchain.id,
        wallet_address: wallet,
        market_symbol: `${current.symbol}_${current.quoteSymbol}`,
        side,
        price: price * 1,
        amount: amount * 1,
      })

      if (typedData?.error) {
        return handleError('Order not created', 'Please try again to place your order.')
      }

      let {types} = typedData.data.sign_data
      delete types.EIP712Domain
      const temp = {
        ...typedData.data.sign_data,
        types,
      }

      appLog('Sign Typed Data')
      const signature = await walletClient.signTypedData(temp).catch(error => {
        appLog(`Signature error ${error.shortMessage}`)
        return handleError('Order not created', 'Please check your wallet and try again to place your order.')
      })

      if (!signature) {
        appLog(`Signature failed`)
        return
      }

      appLog(`Place Order`)
      const result = await $orders.api.place({
        ...typedData.data.limit_order,
        signature,
      })

      if (result?.error) {
        // return handleError('Order not created', 'Please try again to place your order.')
        return handleError('Order not created', result.error)
      }

      appLog(`Place Order Success`)
      const vid = localStorage.getItem('ms_vid')
      if (vid) {
        $app.api.volume({
          wallet_address: wallet,
          vid,
        })
      }

      if (onClose) {
        onClose()
      }
    }
  }

  const handleError = (title, text = 'Something went wrong') => {
    dispatch($alert.set.error({ title, text }))
    if (onClose) {
      onClose()
    }
  }

  const Summary = () => {
    return (
        <App.Flex column fullWidth gap={6}>
          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={10} weight={600} height={1}>You {side == 'buy' ? 'Pay' : 'Sell'}</App.Text>
            <App.Text color="#5E5C6B" size={10} weight={600} height={1}>You Get</App.Text>
          </App.Flex>

          <App.Flex justify="space-between">
            <App.Flex row align="center" gap={4}>
              <Image src={side === 'buy' ? blockchain?.token?.image : current.image} width={25} height={25} alt="" />
              <App.Flex column gap={4}>
                <App.Text size={12} weight={600} height={1} color="#B9B8C5">{side === 'buy' ? total : amount } {side === 'buy' ? current.quoteSymbol : current.symbol}</App.Text>
                {side === 'buy' ? (
                    <App.Text size={10} weight={600} height={1} color="#5E5C6B">${ total }</App.Text>
                ) : null}
              </App.Flex>
            </App.Flex>

            <App.Icon icon="arrow-right-long" />

            <App.Flex align="center" gap={4}>
              <Image src={side === 'buy' ? current.image : blockchain?.token?.image} width={25} height={25} alt="" />
              <App.Flex column gap={4}>
                <App.Text size={12} weight={600} height={1} color="#B9B8C5">{ side === 'buy' ? amount : total } {side === 'buy' ? current.symbol : current.quoteSymbol}</App.Text>
                {side === 'sell' ? (
                    <App.Text size={10} weight={600} height={1} color="#5E5C6B">${ total }</App.Text>
                ) : null}
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
    )
  }

  return (
      <App.Flex column fullWidth>
        {version == 'mobile' ? (
            <App.Flex className={cn(styles.header, styles[side])} center>
              <App.Text center weight={700} size={16} capitalize>
                {side} {side === 'buy' ? current.symbol : current.quoteSymbol} with {side === 'sell' ? current.symbol : current.quoteSymbol}
              </App.Text>

              {step == 'preview' ? (
                  <App.Flex align="center" justify="center" onClick={onBack} className={styles.backButton}>
                    <App.Icon icon="arrow-right" color="#fff" width={24} height={24} />
                  </App.Flex>
              ) : null}
            </App.Flex>
        ) : null}

        {step == 'preview' ? (
            <App.Flex column fullWidth gap={24}>
              <App.Flex column gap={16} fullWidth sx={{ padding: '16px 24px 0' }}>
                <App.Flex column fullWidth gap={12}>
                  <App.Text color="#B9B8C5" weight={600}>Summary</App.Text>
                  {Summary()}
                </App.Flex>

                <App.Hr color="#2a283c" />

                <App.Flex column fullWidth gap={12}>
                  <App.Text color="#B9B8C5" weight={600}>Order Information</App.Text>

                  <App.Flex column fullWidth gap={8}>
                    <App.Flex row align="center" justify="space-between">
                      <App.Text size={12} height={1} color="#5E5C6B">Type</App.Text>
                      <App.Text size={12} height={1} color="#B9B8C5">Limit</App.Text>
                    </App.Flex>

                    <App.Flex row align="center" justify="space-between">
                      <App.Text size={12} height={1} color="#5E5C6B">At Price</App.Text>
                      <App.Text size={12} height={1} color="#B9B8C5">{ price } {current.quoteSymbol}</App.Text>
                    </App.Flex>

                    <App.Flex row align="center" justify="space-between">
                      <App.Text size={12} height={1} color="#5E5C6B">Amount</App.Text>
                      <App.Text size={12} height={1} color="#B9B8C5">{ amount } {current.symbol}</App.Text>
                    </App.Flex>

                    <App.Flex row align="center" justify="space-between">
                      <App.Text size={12} height={1} color="#5E5C6B">Total</App.Text>
                      <App.Text size={12} height={1} color="#B9B8C5">{ total } {current.quoteSymbol}</App.Text>
                    </App.Flex>

                    <App.Flex row align="center" justify="space-between">
                      <App.Text size={12} height={1} italic color="#5E5C6B">Fee: {blockchain.info.fee} | Gas: 0 </App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </App.Flex>

              <App.Hr color="#2a283c" />

              <App.Flex row center sx={{ padding: '0 16px 16px' }}>
                <App.Button xl variant={side == 'buy' ? 'success' : 'danger'} fullWidth onClick={handleNextStep}>
                  CONFIRM {side.toUpperCase()}
                </App.Button>
              </App.Flex>
            </App.Flex>
        ) : null}

        {step == 'sign' || step == 'place' ? (
            isApp ? (
                <App.Flex column center gap={6} sx={{ padding: '8px 24px 16px' }}>
                  <App.Flex row center width={170} height={170}>
                    <App.Loader size={150} />
                  </App.Flex>

                  <App.Text center size={16} weight={700} height={1}>Waiting for Blockchain Confirmation</App.Text>
                  <App.Text center size={10} height={1} color="#5E5C6B">It will take a few seconds</App.Text>
                </App.Flex>
            ) : (
                <App.Flex column fullWidth gap={8} sx={{ padding: '16px 24px' }}>
                  <App.Flex row align="flex-end" gap={6}>
                    <App.Flex column center gap={2} flex={1}>
                      <App.Flex row center gap={2}>
                        <Image src="/images/icon-key.png" width={10} height={10} alt="" />
                        <App.Text center size={12} height={1} color="#53F19C">Approve</App.Text>
                      </App.Flex>

                      <div className={cn(styles.tabLine, styles.active)} />
                    </App.Flex>

                    <App.Flex column center gap={2} flex={1}>
                      <App.Flex row center gap={2}>
                        <Image src="/images/icon-lightning.png" width={10} height={10} alt="" />
                        <App.Text center size={12} height={1} color={step == 'place' ? '#53F19C' : '#5E5C6B'}>Place order</App.Text>
                      </App.Flex>

                      <div className={cn(styles.tabLine, {[styles.active]: step == 'place'})} />
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row>
                    <App.Flex row align="center" justify="flex-start" className={styles.stepBox}>
                      <App.Text size={10} weight={600} color="#5E5C6B">Step {step == 'sign' ? 1 : 2}/2</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row center fullWidth>
                    <App.Flex width={98} height={98}>
                      <Image src={`/images/order-${step == 'sign' ? 'approve' : 'confirm'}-loader.gif`} width={98} height={98} alt="" />
                    </App.Flex>
                  </App.Flex>

                  <App.Flex column center fullWidth gap={16}>
                    <App.Flex column center gap={10} width={265}>
                      <App.Text center size={16} weight={600} height={1}>{step == 'sign' ? 'Approve the Trade!' : 'Confirm Order'}</App.Text>
                      <App.Text center size={12} color="#B9B8C5" height={1.2}>{step == 'sign' ? `Tap 'Approve' in your wallet to unleash ${side == 'buy' ? current.symbol : current.quoteSymbol} trading power on Tegro` : 'Authorize the transaction on your wallet to finalize the trade'}</App.Text>
                    </App.Flex>

                    {Summary()}

                    <App.Text center size={10} height={1} color="#5E5C6B">Please proceed in your wallet</App.Text>
                  </App.Flex>
                </App.Flex>
            )
        ) : null}
      </App.Flex>
  )
}

export default OrderConfirm