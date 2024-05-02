import App from '@/components/App'
import Home from '@/components/Home'

import styles from './styles.module.scss'

const LandingPage = () => {
  return (
    <App.Flex column className={styles.container}>
      <div className={styles.background} />
      {process.env.NEXT_PUBLIC_APP_ENV == 'production' ? <Home.Hero /> : <Home.Top />}
      {/* <Home.Stats /> */}
      <Home.Features />
      <Home.Press />
      {/* <Home.Team /> */}
      <Home.Community />
      <Home.Faq />
    </App.Flex>
  )
}

export default LandingPage