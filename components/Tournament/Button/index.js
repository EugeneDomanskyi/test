import App from '@/components/App'

import styles from './styles.module.scss'

const Button = ({children, sx = {}, onClick}) => {
  return (
      <App.Flex column className={styles.container} style={sx}>
        <App.Flex flex={1} align={'center'} justify={'center'} onClick={onClick} className={styles.button}>
          {
            typeof children === 'string'
              ? <App.Text weight={600} size={16}>{ children }</App.Text>
              : children
          }
        </App.Flex>
      </App.Flex>
  )
}

export default Button
