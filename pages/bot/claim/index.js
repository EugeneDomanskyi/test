import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { parseUnits } from 'viem'
import cn from 'classnames'

import WagmiHelper from '@/libs/WagmiHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'
import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'
import $auction from '@/store/auction'
import $gem from '@/store/gem'
import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'
import AuctionShareImage from '@/components/Auction/AuctionShareImage'

import styles from './styles.module.scss'

const BotClaim = () => {
  const router = useRouter()
  const { id, hash } = router.query

  const { connection, connect } = useWagmiHelper()

  const dispatch = useDispatch()
  const claimAuction = useSelector(({ $auction }) => $auction.claimAuction)

  const [loadingPage, setLoadingPage] = useState(true)
  const [loadingConnect, setLoadingConnect] = useState(false)
  const [loadingImage, setLoadingImage] = useState(true)
  const [loadingPay, setLoadingPay] = useState(false)
  const [step, setStep] = useState(1)
  const [initCheck, setInitCheck] = useState(true)
  const [claimImage, setClaimImage] = useState()
  const [scanLink, setScanLink] = useState()
  const [txDialogVisible, setTxDialogVisible] = useState(false)
  const [txId, setTxId] = useState('')
  const [txLoading, setTxLoading] = useState(false)

  useEffect(() => {
    if (!connection.loading) {
      if (connection.connected) {
        if (initCheck) {
          console.log('Disconnect wallet in useEffect')
          WagmiHelper.disconnect()
        }
      } else {
        setStep(1)
      }
    }
  }, [connection])

  useEffect(() => {
    if (id) {
      fetchInfo()
    }
  }, [id])

  useEffect(() => {
    if (claimAuction?.id) {
      if (claimAuction.txHash && claimAuction.txHash != '') {
        if (claimAuction.claimTxHash && claimAuction.claimTxHash != '') {
          console.log(claimAuction)
          setScanLink(WagmiHelper.generateScanUrl(claimAuction.claimTxHash, 'tx'))
          setStep(4)
        } else {
          reclaim()
        }
      }
    }
  }, [claimAuction])

  const reclaim = async () => {
    const result = await $gem.api.claimTelegram({ auction_id: claimAuction.id, external_user_hash: hash })
    if (result && result?.error) {
      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Something went wrong', text: result.error}))
      return
    }

    setScanLink(WagmiHelper.generateScanUrl(result.auction.claim_tx_hash, 'tx'))
    setStep(4)
  }

  const fetchInfo = async () => {
    const result = await $auction.api.getTelegram(id)
    if (result) {
      dispatch($auction.set.claimAuction(result))
    }

    setLoadingPage(false)
  }

  const handleConnect = async () => {
    setInitCheck(false)
    setLoadingConnect(true)

    Amplitude.event(`Connect wallet for checkout`, {
      'Page': 'Auction Checkout',
    })

    const tempWallet = WagmiHelper.getWallet()
    if (tempWallet) {
      console.log('Wallet before connect', tempWallet)
      console.log('Disconnect wallet in Connect')
      await WagmiHelper.disconnect()
    }
    
    try {
      const result = await connect()
      if (result) {
        Amplitude.event(`Connect wallet for checkout`, {
          'Page': 'Auction Checkout',
          'Result': 'Success',
        })

        const create = await $gem.api.register({ wallet_address: result, referral_code: localStorage.getItem('referral') ?? '' })
        if (create && !create.error) {
          await $bot.api.assignWalletToUser({wallet_address: result, hash})
          setStep(2)
        }
      } else {
        Amplitude.event(`Connect wallet for checkout`, {
          'Page': 'Auction Checkout',
          'Result': 'Failed',
        })
      }
    } catch (e) {
      console.log('Error during connect', e)

      Amplitude.event(`Connect wallet for checkout`, {
        'Page': 'Auction Checkout',
        'Result': 'Failed',
      })
    }

    setLoadingConnect(false)
  }

  const handleShare = () => {
    Amplitude.event(`Shared on twitter`, {
      'Page': 'Auction Checkout',
    })

    const link = `${window.location.origin}/auctions`
    const tweetText = claimImage ? `${link}?share=${claimImage}` : encodeURIComponent(`
🚀 Unbelievable! I just bagged ${claimAuction.name} for just ${claimAuction.currentPrice} ${claimAuction.token.currency} on Tegro! 👀

That's a whopping ${claimAuction.discount}% off! 😱

You don't wanna miss these insane deals! ✨

🔗 Connect your wallet & place the BID now at ${link}
    `)

    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl)

    setStep(3)
  }

  const handlePay = async () => {
    setLoadingPay(true)
    setScanLink(null)

    Amplitude.event(`Click on Pay`, {
      'Page': 'Auction Checkout',
    })

    const chainCode = (window.location.hostname == 'tegro.com' || window.location.hostname == 'nft20-git-production-toraverse.vercel.app' || window.location.hostname == 'testnet.tegro.com') ? 'base' : 'amoy' 
    const network = await WagmiHelper.changeChain(chainCode)
    if (!network) {
      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Something went wrong'}))
      return
    }
    dispatch($app.set.code(chainCode))

    const balance = await WagmiHelper.balanceOf(claimAuction.token.address, chainCode)
    if ( ! balance) {
      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Something went wrong', text: 'Can not get balance of your wallet'}))
      return
    }
    console.log('Balance is ', balance)
    
    if (balance && balance < claimAuction.currentPrice) {
      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Insufficient balance'}))
      return
    }

    const price = parseUnits(claimAuction.currentPrice, claimAuction.token.decimals)
    const txid = await WagmiHelper.transfer(claimAuction.token.address, claimAuction.claimContract, price, chainCode)
    if (txid && txid?.error) {
      Amplitude.event(`Payment pending`, {
        'Page': 'Auction Checkout',
      })

      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Something went wrong', text: txid.error}))
      return
    }
    console.log('Transaction ID received', txid)
    Amplitude.event(`Pay success`, {
      'Page': 'Auction Checkout',
    })

    $auction.api.txHash({ auction_id: claimAuction.id, tx_hash: txid, external_user_hash: hash })

    console.log('Start listen the Transaction result')
    const temp = await WagmiHelper.waitForTransaction(txid)
    if (temp && temp?.error) {
      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Something went wrong', text: temp.error}))
      return
    }

    Amplitude.event(`Transaction finished, call claim endpoint`, {
      'Page': 'Auction Checkout',
    })

    console.log('Call claim endpoint')
    const result = await $gem.api.claimTelegram({ auction_id: claimAuction.id, external_user_hash: hash })
    if (result && result?.error) {
      Amplitude.event(`Claim failed`, {
        'Page': 'Auction Checkout',
      })

      setLoadingPay(false)
      dispatch($alert.set.error({title: 'Something went wrong', text: result.error}))
      return
    }

    Amplitude.event(`Claim success`, {
      'Page': 'Auction Checkout',
    })

    if (result?.auction?.claim_tx_hash && result.auction.claim_tx_hash != '') {
      setScanLink(WagmiHelper.generateScanUrl(result.auction.claim_tx_hash, 'tx'))
    }
    setStep(4)
  }

  const handleImageGenerated = (image) => {
    setLoadingImage(false)
    setClaimImage(image)
  }

  const handleEnterTx = () => {
    Amplitude.event(`Clicked on "Paid already but din't receive rewards"`, {
      'Page': 'Auction Checkout',
    })

    setTxDialogVisible(true)
  }

  const handleTxDialogClose = () => {
    setTxDialogVisible(false)
  }

  const handleScan = () => {
    window.open(scanLink, '_blank')
  }

  const handleTxIdChange = (value) => {
    setTxId(value)
  }

  const handleTxIdSubmit = async () => {
    if (txId != '') {
      setTxLoading(true)
      const result = await $auction.api.saveTxId({
        auction_id: claimAuction.id,
        external_user_hash: hash,
        tx_hash: txId,
      })
      
      if (result && !result.error) {
        Amplitude.event(`Submit tx manually success`, {
          'Page': 'Auction Checkout',
        })

        setScanLink(WagmiHelper.generateScanUrl(result.auction.claim_tx_hash, 'tx'))
        setStep(4)
        setTxDialogVisible(false)
      } else {
        Amplitude.event(`Submit tx manually failed`, {
          'Page': 'Auction Checkout',
        })

        dispatch($alert.set.error({title: 'Verification failed', text: 'We were not able to validate your transaction. Reach out to us on Discord for help.'}))
      }
      setTxLoading(false)
    }
  }

  return loadingPage ? (
    <App.LoaderBlock />
  ) : (
    <App.Flex column fullWidth justify="space-between" className={styles.container}>
      {claimAuction?.id ? (
        step == 4 ? (
          <App.Flex column center gap={16} className={styles.success}>
            <App.Flex center className={styles.bigCircle}>
              <App.Icon icon="check" width={50} height={40} color="#303745" />
            </App.Flex>

            <App.Text center size={24} weight={600} height={1}>Deposit Successful!</App.Text>
            <App.Text center size={16} weight={400} color="#FFFFFFCC" height={1}>{claimAuction.name} has been sent to your wallet</App.Text>
          </App.Flex>
        ) : (
          <App.Flex column>
            <AuctionShareImage claimItem={claimAuction} onFinish={handleImageGenerated} />

            <App.Flex column gap={4} className={styles.section}>
              <App.Text size={20} weight={700} height={1}>Buy {claimAuction.name} for {claimAuction.currentPrice} {claimAuction.token.currency}</App.Text>
              <App.Text size={14} weight={400} color="#FFFFFFCC">Complete the steps to claim your rewards to your wallet.</App.Text>
            </App.Flex>

            <App.Flex column gap={8} className={styles.section}>
              <App.Flex row justify="space-between" gap={16}>
                <App.Text size={20} weight={700} height={1}>1. Connect Wallet</App.Text>

                {loadingConnect ? (
                  <App.Loader size={24} />
                ) : (
                  <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 2})}>
                    <App.Icon icon="check" width={10} height={8} />
                  </App.Flex>
                )}
              </App.Flex>
              
              {step == 1 ? (
                <App.Flex column gap={8}>
                  <App.Flex column gap={4} className={styles.hint}>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">&bull; Return to this page after you’ve connected your wallet.</App.Text>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">&bull; Please do not refresh this page.</App.Text>
                  </App.Flex>

                  <App.Button variant="bot" loading={loadingConnect} disabled={loadingConnect} onClick={handleConnect}>Connect Wallet</App.Button>
                </App.Flex>
              ) : null}
            </App.Flex>

            <App.Flex column gap={8} className={styles.section}>
              <App.Flex row justify="space-between" gap={16}>
                <App.Text size={20} weight={700} height={1}>2. Share on Twitter</App.Text>

                <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 3})}>
                  <App.Icon icon="check" width={10} height={8} />
                </App.Flex>
              </App.Flex>
              
              {step == 2 ? (
                <App.Flex column gap={8}>
                  <App.Text size={14} weight={400} color="#FFFFFFCC">Let your friends know about your victory!</App.Text>
                  <App.Button loading={loadingImage} disabled={loadingImage} twitter fullWidth onClick={handleShare}><App.Icon icon="x2" /> Tweet Now</App.Button>
                </App.Flex>
              ) : null}
            </App.Flex>

            <App.Flex column gap={8} className={styles.section}>
              <App.Flex row justify="space-between" gap={16}>
                <App.Text size={20} weight={700} height={1}>3. Pay {claimAuction.currentPrice} {claimAuction.token.currency}</App.Text>

                {loadingPay ? (
                  <App.Loader size={24} />
                ) : (
                  <App.Flex center className={cn(styles.circle, {[styles.active]: step >= 4})}>
                    <App.Icon icon="check" width={10} height={8} />
                  </App.Flex>
                )}
              </App.Flex>
              
              {step == 3 ? (
                <App.Flex column gap={8}>
                  <App.Flex column gap={4} className={styles.hint}>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">&bull; Please make sure you have {claimAuction.currentPrice} {claimAuction.token.currency} in your wallet to complete this transaction.</App.Text>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">&bull; Keep ETH (base) in your wallet to cover gas fees.</App.Text>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">&bull; Please do not refresh this page.</App.Text>
                  </App.Flex>

                  <App.Button variant="bot" loading={loadingPay} disabled={loadingPay} onClick={handlePay}>Pay {claimAuction.currentPrice} {claimAuction.token.currency}</App.Button>
                </App.Flex>
              ) : null}
            </App.Flex>

            <App.Flex column gap={24} className={styles.padding}>
              <App.Text center size={14} weight={600} color="#6B41EB" className={styles.link}><a onClick={handleEnterTx}>Paid {claimAuction.currentPrice} {claimAuction.token.currency} already, and didn’t receive your rewards?</a></App.Text>

              {step == 3 ? (
                loadingPay ? (
                  <App.Flex column center gap={4} className={cn(styles.hint, styles.warning)}>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">Please do not refresh this page.</App.Text>
                  </App.Flex>
                ) : (
                  <App.Flex column gap={4} className={cn(styles.hint, styles.warning)}>
                    <App.Text size={14} weight={400} color="#FFFFFFCC">Please return to this page after completing the transaction in your wallet</App.Text>
                  </App.Flex>
                )
              ) : null}
            </App.Flex>
          </App.Flex>
        )
      ) : null}

      {step == 4 ? (
        <App.Flex column gap={24} className={styles.padding}>
          <App.Button fullWidth href={`tg://resolve?domain=${TelegramBot.domain()}`} primary2 outlined>Return to app</App.Button>
          {scanLink ? (
            <App.Flex row center gap={8} onClick={handleScan}>
              <App.Text size={14} weight={600} height={1} color="#6B41EB">View on Basescan</App.Text>
              <App.Icon icon="arrow-45" color="#6B41EB" />
            </App.Flex>
          ) : null}

          <App.Flex />
        </App.Flex>
      ) : (
        <App.Flex row justify="flex-end" className={styles.discord}>
          <App.Button href="https://discord.com/invite/tegro" primary2 outlined rounded><App.Icon icon="discord2" /> Need help?</App.Button>
        </App.Flex>
      )}

      <App.Dialog open={txDialogVisible} title="Enter your transaction hash" onClose={handleTxDialogClose}>
        <App.Flex column gap={16} className={styles.modal}>
          <App.Flex column>
            <App.Text size={12} weight={400} color="#FFFFFF99">Transaction hash</App.Text>
            <App.TextField
              value={txId}
              placeholder="Paste your transaction hash here"
              onChange={handleTxIdChange}
            />
          </App.Flex>

          <App.Text size={14} weight={400} color="#FFFFFF99">You’ll be able to find this using an explorer like basescan.</App.Text>

          <App.Button variant="bot" loading={txLoading} disabled={txLoading} onClick={handleTxIdSubmit}>Submit</App.Button>
        </App.Flex>
      </App.Dialog>
    </App.Flex>
  )
}

export default BotClaim