import App from '@/components/App'
import Landing from '@/components/Landing'

import styles from './styles.module.scss'

const LandingPage = () => {
  return (
    <App.Flex column gap={[130, 70]} className={styles.container}>
      <Landing.Grid />
      {/* <Landing.Slides /> */}
      <Landing.Head />
      <Landing.Platform />
      <Landing.Founders />
      <Landing.Footer />
    </App.Flex>
  )
}

export default LandingPage