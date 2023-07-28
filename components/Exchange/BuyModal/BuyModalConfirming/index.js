import App from '@/components/App'

const BuyModalConfirming = () => {
  return (
    <App.Flex column align="center" justify="center" sx={{height: 230}}>
      <App.Flex sx={{marginBottom: 24}}>
        <App.Loader size={45} color="#7204FF" />
      </App.Flex>
      <App.Text size={20} weight={700}>Confirming</App.Text>
      <App.Text color="#B9B8C5" weight={500}>Please confirm the transfer in your wallet</App.Text>
    </App.Flex>
  )
}

export default BuyModalConfirming
