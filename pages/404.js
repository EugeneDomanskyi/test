import App from '@/components/App'

const PageNotFound = () => {
  return (
    <App.Flex column full center>
      <App.Text size={48} weight={600}>404</App.Text>
      <App.Text size={18} weight={600}>Page Not Found</App.Text>
    </App.Flex>
  )
}

export default PageNotFound