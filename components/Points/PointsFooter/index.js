import App from '@/components/App'

import styles from './styles.module.scss'

const PointsFooter = () => {
  return (
    <App.Flex className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex row align="center" justify="space-between">
          <App.Text weight={400}>Tegro.com</App.Text>
          <App.Text weight={400} color="#FFFFFF99">All Rights Reserved</App.Text>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsFooter