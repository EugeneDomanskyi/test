import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const MintModalApprove = ({ nfts, token, onBack, onApprove }) => {
  const { isMobile } = usePropsHelper()

  const handleApprove = () => {
    if (onApprove) {
      onApprove()
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  return (
    <App.Flex column>
      <App.Flex column gap={32} align="center" className={styles.content}>
        <App.Flex column gap={4}>
          <App.Text center size={20} weight={600}>Grant Approval</App.Text>
          <App.Text center color="#B9B8C5">First, you need to grant approval to our contract</App.Text>
        </App.Flex>

        <App.Flex row center gap={8}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={16}>{nfts.length} {token.collection} NFT{nfts.length > 1 ? 's' : ''}</App.Text>

          <App.Icon icon="arrow-right" />

          <div className={styles.imgSquare}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={16}>{nfts.length} {token.code} NFT20</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={32} className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleApprove} sx={{ width: isMobile ? '100%' : 200 }}>Approve</App.Button>

        <App.Flex row gap={8} onClick={handleBack} className={styles.link}>
          <App.Icon icon="chevron-left" />
          <App.Text color="#B9B8C5">Go Back</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default MintModalApprove