import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import $collection from '@/store/collection'

import App from '@/components/App'
import { WebIcon, TwitterIcon, DiscordIcon } from '@/components/Icons/exchange'

const CollectionInfo = ({collectionId}) => {

  const currentCollection = useSelector($collection.get.collection('address', collectionId))

  console.log(currentCollection)
  
  return (
    <App.Flex className={styles.container}>
      {
        currentCollection?.image
          ? <Image
              width={130}
              height={130}
              alt=""
              className={styles.image}
              src={currentCollection?.image} />
          : null
      }
      <App.Flex flex={1} column>
        <App.Flex column flex={1}>
          <App.Text>{ currentCollection?.name }</App.Text>
          <App.Text size={12} color="rgba(255, 255, 255, 0.5)" flex={1}>{ currentCollection?.description }</App.Text>
        </App.Flex>
        <App.Flex sx={{marginTop: 'auto'}}>
          <App.Flex column sx={{marginRight: 'auto'}}>
            <App.Text size={24}>${ currentCollection?.price }</App.Text>
            <App.Flex align="center">
              <Link href={currentCollection?.externalUrl ?? ''} target="_blank" style={{marginRight: 5}}>
                <WebIcon />
              </Link>
              <Link href={currentCollection?.twitterUrl ?? ''} target="_blank" style={{marginRight: 8}}>
                <TwitterIcon />
              </Link>
              <Link href={currentCollection?.discordUrl ?? ''} target="_blank">
                <DiscordIcon />
              </Link>
            </App.Flex>
          </App.Flex>
          <App.Flex column align="center" justify="center" sx={{padding: '0 16px', backgroundColor: '#1a162e', borderRadius: 8, marginRight: 16}}>
            <App.Text size={12}>Total count</App.Text>
            <App.Text size={18}>{ currentCollection?.tokenCount }</App.Text>
          </App.Flex>
          <App.Flex column align="center" justify="center" sx={{padding: '0 16px', backgroundColor: '#1a162e', borderRadius: 8, marginRight: 16}}>
            <App.Text size={12}>Listed count</App.Text>
            <App.Text size={18}>{ currentCollection?.onSaleCount }</App.Text>
          </App.Flex>
          <App.Flex column align="center" justify="center" sx={{padding: '0 16px', backgroundColor: '#1a162e', borderRadius: 8}}>
            <App.Text size={12}>OpenSea verification status</App.Text>
            <App.Text size={18} uppercase color={currentCollection?.openseaVerificationStatus === 'verified' ? 'rgb(13, 198, 109)' : 'rgb(206, 22, 93)'}>{ currentCollection?.openseaVerificationStatus }</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default CollectionInfo
