import styles from './styles.module.scss'
import App from '@/components/App'

const SellModalConfirm = ({price, amount, total, onConfirm}) => {
  return (
    <App.Flex column>
      <App.Flex justify="space-between" align="center" sx={{height: 35, padding: '0 8px'}}>
        <App.Text color="#5E5C6B" weight={600} size={12}>Type</App.Text>
        <App.Text color="#B9B8C5" weight={600} size={12}>Limit</App.Text>
      </App.Flex>
      <App.Flex justify="space-between" align="center" sx={{height: 35, padding: '0 8px'}}>
        <App.Text color="#5E5C6B" weight={600} size={12}>At price</App.Text>
        <App.Text color="#B9B8C5" weight={600} size={12}>{ price }</App.Text>
      </App.Flex>
      <App.Flex justify="space-between" align="center" sx={{height: 35, padding: '0 8px'}}>
        <App.Text color="#5E5C6B" weight={600} size={12}>Amount</App.Text>
        <App.Text color="#B9B8C5" weight={600} size={12}>{ amount }</App.Text>
      </App.Flex>
      <App.Flex justify="space-between" align="center" sx={{height: 35, padding: '0 8px'}}>
        <App.Text color="#5E5C6B" weight={600} size={12}>Total</App.Text>
        <App.Text color="#B9B8C5" weight={600} size={12}>{ total }</App.Text>
      </App.Flex>
      <App.Flex className={styles.footer}>
        <App.Flex justify="center" align="center" className={styles.button} onClick={onConfirm}>
          <App.Text color="#09051D" size={15} weight={700}>CONFIRM SELL</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default SellModalConfirm
