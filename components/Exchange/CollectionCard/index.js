import styles from './styles.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'

import App from  '@/components/App'

const CollectionCard = ({id, address, image, name, price, isActive, ...rest}) => {
  return (
    <Link href={`/exchange/${address}`} scroll={false}>
      <App.Flex gap={16} align="center" className={cn(styles.collection, {[styles.active]: isActive})}>
        {
          image
            ? <Image src={image} width={72} height={72} className={styles.image} alt="" />
            : <div style={{width: 72, height: 72}} />
        }
        <App.Text weight={700} flex={1}>{name}</App.Text>
        <App.Text>${ price }</App.Text>
      </App.Flex>
    </Link>
  )
}

export default CollectionCard
