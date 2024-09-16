import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $gem from '@/store/gem'

import bg from '../../../public/images/auction-share-background.png'

const AuctionShareImage = ({ onFinish }) => {
  const dispatch = useDispatch()
  const claimItem = useSelector($gem.get.claimItem)

  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)

  const [debug, setDebug] = useState('')

  useEffect(() => {
    // setDebug(claimItem ? 'ClaimItem ID: ' + claimItem.id : 'No claim item')
    // setDebug(state => {
    //   return (
    //     state + '\n' +
    //     'saveImage...'
    //   )
    // })
    if (claimItem) {
      ctxRef.current = canvasRef.current.getContext('2d')

      generateImage()
    }
  }, [claimItem])

  const generateImage = () => {
    const image = new Image()
    image.src = bg.src
    image.onload = printText(image)
  }

  const printText = (image) => () => {
    ctxRef.current.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height)

    let gradient = ctxRef.current.createRadialGradient(
      canvasRef.current.width * 0.9629,
      canvasRef.current.height * 0.0449,
      0,
      canvasRef.current.width * 0.5,
      canvasRef.current.height * 0.5,
      canvasRef.current.width
    )

    gradient.addColorStop(0, '#FFF6A3')
    gradient.addColorStop(0.3461, '#FFF066')
    gradient.addColorStop(0.6883, '#FFCB45')
    gradient.addColorStop(1, '#FFBD13')

    ctxRef.current.font = 'bold 48px Gilroy'
    ctxRef.current.fillStyle = gradient
    ctxRef.current.fillText(`I beat ${claimItem.bidsCount} bid${claimItem.bidsCount > 1 ? 's' : ''} and won 🥇`, 60, 180)

    ctxRef.current.font = 'bold 96px Gilroy'
    ctxRef.current.fillStyle = '#fff'
    ctxRef.current.fillText(`${claimItem.name} at`, 60, 300)

    ctxRef.current.fillStyle = '#A6DC37'
    ctxRef.current.fillText(`${claimItem.currentPrice} ${claimItem.token.currency}`, 60, 400)

    ctxRef.current.font = '36px Gilroy'
    ctxRef.current.fillStyle = '#fff'
    ctxRef.current.fillText('Market Price', 60, 480)
    ctxRef.current.fillText(`$${claimItem.marketPrice}`, 370, 480)

    ctxRef.current.fillText('Auction Discount', 60, 530)
    ctxRef.current.fillStyle = '#A6DC37'
    ctxRef.current.fillText(`${claimItem.discount}%`, 370, 530)

    canvasRef.current.toBlob(saveImage)
  }

  const saveImage = async (blob) => {
    let host = 'd'
    if (window.location.hostname == 'testnet.tegro.com') {
      host = 't'
    }

    if (window.location.hostname == 'tegro.com' || window.location.hostname == 'nft20-git-production-toraverse.vercel.app') {
      host = 'p'
    }

    const image = `${host}${claimItem.id}`
    const formData = new FormData()
    formData.append('file', blob, `${image}.png`)
    formData.append('filename', image)

    await $gem.api.upload(formData)

    if (onFinish) {
      onFinish(image)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={675}
      style={{ display: 'none' }}
    />
  )
}

export default AuctionShareImage