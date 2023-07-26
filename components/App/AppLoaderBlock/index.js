import App from '@/components/App'

const AppLoaderBlock = ({ height = 300 }) => {
  return (
    <App.Flex center height={height}>
      <App.Loader size={40} />
    </App.Flex>
  )
}

export default AppLoaderBlock