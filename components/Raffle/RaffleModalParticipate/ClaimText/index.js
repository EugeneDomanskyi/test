import App from '@/components/App'

import styles from './styles.module.scss'

const ClaimText = ({title, subTitle}) => {
  return (
    <App.Flex column gap={12}>
      <App.Text center size={20} weight={500} className={styles.stepTitle}>{title}</App.Text>
      <App.Text center size={14} weight={500} color="#B9B8C5">{subTitle}</App.Text>
    </App.Flex>
  )
}

export default ClaimText