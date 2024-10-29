import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Slider from 'react-slick'
import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import $auction from '@/store/auction'

import App from '@/components/App'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './styles.module.scss'

const BotHeaderTimer = ({ timestamp }) => {
  const intervalRef = useRef(null)

  const dispatch = useDispatch()
  const ongoingAuction = useSelector($auction.get.ongoingAuction)
  const showUpcoming = useSelector(({ $auction }) => $auction.showUpcoming)
  const onboard = useSelector(({ $bot }) => $bot.onboard)
  const mega_auction = useSelector(({ $auction }) => $auction.mega_auction)

  const [timeLeft, setTimeLeft] = useState(moment(timestamp).diff(moment()))

  const sliderRef = useRef(null)

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    swipe: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  useEffect(() => {
    if (timestamp && ! moment(timestamp).isBefore(moment())) {
      intervalRef.current = setInterval(() => {
        const now = moment()
        const duration = moment(timestamp).diff(now)
        if (duration <= 10000 && !showUpcoming) {
          dispatch($auction.set.showUpcoming(true))
        }

        if (duration <= -1000) {
          dispatch($auction.set.showUpcoming(false))
          clearInterval(intervalRef.current)
          setTimeLeft(0)
          return
        }

        setTimeLeft(duration)
      }, 1000)

      // return () => clearInterval(intervalRef.current)
    }
  }, [timestamp])

  const formatTime = (milliseconds) => {
    const duration = moment.duration(milliseconds)
    const days = duration.days()
    const hours = duration.hours()
    const minutes = String(duration.minutes()).padStart(2, '0')
    const seconds = String(duration.seconds()).padStart(2, '0')
    return `${days ? days + 'd:' : ''} ${hours ? hours + 'h:' : ''}${minutes}m:${seconds}s`
  }

  return mega_auction ? (
    <div className={cn(styles.timerContainer, styles[onboard])}>
      <Slider ref={slider => { sliderRef.current = slider }} {...settings}>
        <div>
          {timeLeft > 0 ? (
            <App.Flex row fullWidth center gap={8} height={32}>
              <App.Text size={13} weight={400}>Next Auction starts in</App.Text>
              <App.Text size={13} weight={600}>{formatTime(timeLeft)}</App.Text>
            </App.Flex>
          ) : (
            <App.Flex row fullWidth center height={32}>
              {ongoingAuction?.id && ongoingAuction.priceLimit > 0 ? (
                <App.Text size={13} weight={400}>👀 Auction ends at <b>{ongoingAuction.priceLimit} {ongoingAuction.token.currency}</b>, scheduled every 10 mins</App.Text>
              ) : (
                <App.Text size={13} weight={400}>New Auctions Scheduled Every 10 Minutes!</App.Text>
              )}
            </App.Flex>
          )}
        </div>
        
        <div>
          <App.Flex row fullWidth center gap={4} height={32}>
            <App.Text size={13} weight={400} height={1}>1 Bid = 1000</App.Text>
            <Image src="/images/bot/gem.png" width={19} height={16} alt="" />
          </App.Flex>
        </div>

        <div>
          <App.Flex row fullWidth center height={32}>
            {ongoingAuction && ongoingAuction.status != 'closed' && ongoingAuction.isMega ? (
              <App.Text size={13} weight={700} color="#FFBB01">$50 USDC Mega Auction! 🤑</App.Text>
            ) : (
              <App.Text size={13} weight={400}><App.Text inline size={13} weight={700} color="#FFBB01">{mega_auction.counter}</App.Text> auction{mega_auction.counter == 1 ? '' : 's'} left for <App.Text inline size={13} weight={700} color="#FFBB01">$50 USDC Mega Auction!</App.Text> 🤑</App.Text>
            )}
          </App.Flex>
        </div>
      </Slider>
    </div>
  ) : null
}

export default BotHeaderTimer