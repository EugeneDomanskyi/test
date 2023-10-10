import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const ClaimImage = ({warningIcon = null, contentImg, dangerIcon = null, onlyShadow}) => {
  return (
    <App.Flex width={330} height={300} className={styles.imageTemplate}>
      <div className={styles.bgGlow} />

      {
        onlyShadow
          ? null
          : <>
              <img src="/images/raffle/claim-image-template-bottom.png" className={cn(styles.image, styles.bottom)} alt="" />
              <Image src="/images/raffle/claim-image-template-top.png" width={120} height={187} className={cn(styles.image, styles.top)} alt="" />
              {
                warningIcon
                  ? <Image src="/images/raffle/warning-icon.png" width={53} height={46} className={styles.imageIcon} alt="" />
                  : null
              }
              {
                dangerIcon
                  ? <Image src="/images/raffle/danger-icon.png" width={53} height={46} className={styles.imageIcon} alt="" />
                  : null
              }
            </>
      }

      {
        contentImg
          ? <Image src={contentImg.src} width={contentImg.width} height={contentImg.height} className={styles.image} alt="" />
          : null
      }
    </App.Flex>
  )
}

export default ClaimImage