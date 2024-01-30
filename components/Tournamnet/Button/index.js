import App from '@/components/App'

import styles from './styles.module.scss'

const Button = ({children, onClick}) => {
  return (
      <App.Flex column className={styles.container}>
        <App.Flex flex={1} align={'center'} justify={'center'} onClick={onClick} className={styles.button}>
          <App.Text weight={600} size={16}>{ children }</App.Text>
        </App.Flex>
      </App.Flex>
  )
}

export default Button
