import styles from './styles.module.scss'

const AppCard = ({children, ...props}) => {
  return (
    <div className={styles.container} {...props}>
      { children }
    </div>
  )
}

export default AppCard
