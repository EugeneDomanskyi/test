import App from '@/components/App'

const Mobile = () => {
  return (
    <App.Flex column>
      <App.Flex row align="center">
        <App.Icon icon="chevron-left" width={24} height={24} color="#fff" />
        <App.Text>Back</App.Text>
      </App.Flex>  
    </App.Flex>
  )
}

export default Mobile