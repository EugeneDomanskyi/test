import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import numeral from 'numeral'
import cn from 'classnames'

import { trackEvent } from '@/libs/analytics.lib'
import Order from '@/libs/structs/Order'
import useWalletConnect from '@/myhooks/wallet-connect'
import { TEGRO_FILL_ORDERS_CONTRACTS } from '@/config'

import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const OrderConfirm = ({ side, blockchain, makerAsset, takerAsset, makerAmountFormatted, takerAmountFormatted, price, onClose }) => {
  const { wallet } = useWalletConnect()
  const dispatch = useDispatch()

  const [step, setStep] = useState('preview')

  const handleNextStep = async () => {
    if (step == 'preview') {
      trackEvent('Confirm Order Submit', {
        'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
        'Quote Currency': 'USDT',
        'Side': side.toUpperCase(),
        'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
        'Price': numeral(price).format('0.[00000]'),
        'Total': numeral(takerAmountFormatted).format('0.[00000]'),
        'Network': blockchain.code.toUpperCase(),
        'Order Type': 'Limit',
        'Step': 'Confirm',
      })

      setStep('sign')
      const result = await Order.Order.checkAllowance(blockchain.id, TEGRO_FILL_ORDERS_CONTRACTS[blockchain.id], wallet, takerAsset.address, takerAmountFormatted * 1)
        .catch(error => {
          onClose()
          dispatch($alert.set.error({ title: 'Trade Not Approved', text: error?.message ?? 'Something went wrong' }))
        })

      if (result?.success) {
        setStep('place')

        trackEvent('Confirm Order Submit', {
          'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
          'Quote Currency': 'USDT',
          'Side': side.toUpperCase(),
          'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
          'Price': numeral(price).format('0.[00000]'),
          'Total': numeral(takerAmountFormatted).format('0.[00000]'),
          'Network': blockchain.code.toUpperCase(),
          'Order Type': 'Limit',
          'Step': 'Sign',
        })

        Order.TOKEN.placeToAPI({ type: side, makerAsset: takerAsset, takerAsset: makerAsset, price: price, amount: makerAmountFormatted }, () => {
          onClose()
        }).catch(error => {
          onClose()
          dispatch($alert.set.error({ title: 'Order Not Created', text: error?.message ?? 'Something went wrong' }))
        })
      }
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
            <Image src={takerAsset.image} width={25} height={25} alt="" />
            <App.Flex column gap={4}>
              <App.Text size={12} weight={600} height={1} color="#B9B8C5">{ numeral(side === 'buy' ? takerAmountFormatted : makerAmountFormatted).format('0.[00000]') } {takerAsset.symbol}</App.Text>
              {side === 'buy' ? (
                <App.Text size={10} weight={600} height={1} color="#5E5C6B">${ numeral(side === 'buy' ? takerAmountFormatted : makerAmountFormatted).format('0.[00000]') }</App.Text>
              ) : null}
            </App.Flex>
          </App.Flex>

          <App.Icon icon="arrow-right-long" />

          <App.Flex align="center" gap={4}>
            <Image src={makerAsset.image} width={25} height={25} alt="" />
            <App.Flex column gap={4}>
              <App.Text size={12} weight={600} height={1} color="#B9B8C5">{ numeral(side === 'buy' ? makerAmountFormatted : takerAmountFormatted).format('0.[00000]') } {makerAsset.symbol}</App.Text>
              {side === 'sell' ? (
                <App.Text size={10} weight={600} height={1} color="#5E5C6B">${ numeral(side === 'buy' ? makerAmountFormatted : takerAmountFormatted).format('0.[00000]') }</App.Text>
              ) : null}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    )
  }

  return (
    <App.Flex column fullWidth>
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
                  <App.Text size={12} height={1} color="#B9B8C5">{ price } {side == 'buy' ? takerAsset.symbol : makerAsset.symbol}</App.Text>
                </App.Flex>

                <App.Flex row align="center" justify="space-between">
                  <App.Text size={12} height={1} color="#5E5C6B">Amount</App.Text>
                  <App.Text size={12} height={1} color="#B9B8C5">{ makerAmountFormatted } {side == 'buy' ? makerAsset.symbol : takerAsset.symbol}</App.Text>
                </App.Flex>

                <App.Flex row align="center" justify="space-between">
                  <App.Text size={12} height={1} color="#5E5C6B">Total</App.Text>
                  <App.Text size={12} height={1} color="#B9B8C5">{ takerAmountFormatted } {side == 'buy' ? takerAsset.symbol : makerAsset.symbol}</App.Text>
                </App.Flex>

                <App.Flex row align="center" justify="space-between">
                  <App.Text size={12} height={1} italic color="#5E5C6B">Fee: 0 | Gas: 0 </App.Text>
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
        <App.Flex column fullWidth gap={8} sx={{ padding: '8px 24px 16px' }}>
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
              <App.Text center size={12} color="#B9B8C5" height={1.2}>{step == 'sign' ? `Tap 'Approve' in your wallet to unleash ${side == 'buy' ? makerAsset.symbol : takerAsset.symbol} trading power on Tegro` : 'Authorize the transaction on your wallet to finalize the trade'}</App.Text>
            </App.Flex>

            {Summary()}

            <App.Text center size={10} height={1} color="#5E5C6B">Please proceed in your wallet</App.Text>
          </App.Flex>
        </App.Flex>
      ) : null}
    </App.Flex>
  )
}

export default OrderConfirm