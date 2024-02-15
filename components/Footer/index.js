import Link from 'next/link'

import App from '@/components/App'

import styles from './styles.module.scss'

const Footer = () => {
  return (
    <App.Container fluid className={styles.footer}>
      <App.Flex direction={['row', 'column']} fullWidth align="center" justify="space-between" gap={40} height={[76, 'auto']} className={styles.container}>
        <App.Flex row align="center" justify={['flex-start', 'space-between']} gap={24} width={['auto', '100%']}>
          <Link href="/" style={{ lineHeight: 0 }}>
            <App.Icon icon="logo" />
          </Link>

          <div className={styles.line} />

          <Link href="https://tegro.com">
            <App.ButtonGradient icon="arrow-45">tegro.com</App.ButtonGradient>
          </Link>
        </App.Flex>

        <App.Text size={14} weight={400}>All Rights Reserved</App.Text>
      </App.Flex>
    </App.Container>
  )
}

export default Footer