import Link from 'next/link'

import App from '@/components/App'

import styles from './styles.module.scss'

const Footer = () => {
  return (
    <App.Container fluid>
      <App.Flex direction={['row', 'column']} fullWidth align="center" justify="space-between" gap={40} height={[76, 'auto']} className={styles.container}>
        <App.Flex row align="center" justify={['flex-start', 'space-between']} gap={24} width={['auto', '100%']}>
          <Link href="/" style={{ lineHeight: 0 }}>
            <App.Icon icon="logo" />
          </Link>

          <div className={styles.line} />

          <Link href="https://tegro.com">
            <App.Frame padding="10px 24px" radius={50} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
              <App.Flex row center gap={16}>
                <App.Text>tegro.com</App.Text>
                <App.Icon icon="arrow-45" />
              </App.Flex>
            </App.Frame>
          </Link>
        </App.Flex>

        <App.Text size={14} weight={400}>All Rights Reserved</App.Text>
      </App.Flex>
    </App.Container>
  )
}

export default Footer