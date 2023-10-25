import App from '@/components/App'

import { trackEvent } from '@/libs/analytics.lib'

import styles from './styles.module.scss'

const Footer = () => {
  const handleClick = (type) => () => {
    // switch (type) {
    //   case 'tegro': return trackEvent('Dex Tegro Redirect')
    //   case 'gitbook': return trackEvent('Dex Gitbook Redirect')
    //   case 'twitter': return trackEvent('Dex Twitter Redirect')
    // }
  }

  return (
    <div className={styles.container}>
      <App.Container>
        <App.Flex direction={['row', 'column']} gap={[0, 16]} sx={{ padding: '32px 0' }}>
          <App.Flex flex={1}>
          </App.Flex>

          <App.Flex column center gap={4} flex={1}>
            <App.Text>Proudly powered by</App.Text>
            <a href="https://tegro.com" target="_blank" rel="noreferrer" onClick={handleClick('tegro')}><App.Icon icon="tegro" /></a>
          </App.Flex>

          <App.Flex row align="center" justify={['flex-end', 'center']} gap={16} flex={1}>
            <a href="https://nft20-1.gitbook.io/nft-20.org/" target="_blank" rel="noreferrer" onClick={handleClick('gitbook')}><App.Text inline>Gitbook</App.Text></a>
            <a href="https://twitter.com/nft20_dex" target="_blank" rel="noreferrer" onClick={handleClick('twitter')}><App.Text inline>Twitter</App.Text></a>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default Footer