import styles from './styles.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'

import App from  '@/components/App'

const CollectionCard = ({id, image, name, isActive}) => {
  return (
    <Link href={`/exchange/${id}`}>
      <App.Flex gap={16} align="center" className={cn(styles.collection, {[styles.active]: isActive})}>
        {
          image
            ? <Image src={image} width={48} height={48} alt="" />
            : <div style={{width: 48, height: 48}} />
        }
        <App.Flex column>
          <App.Text weight={700}>{name}</App.Text>
          {/* <App.Text size={12} weight={400} color="#B9B8C5">{token.game}</App.Text> */}
          {/* <App.Text size={12} weight={400} color="#B9B8C5">{token.code}</App.Text> */}
        </App.Flex>
      </App.Flex>
    </Link>
  )
}

export default CollectionCard
