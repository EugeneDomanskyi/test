import { useSelector } from 'react-redux'

import App from '@/components/App'

export default function Chart() {
  return (
    <App.Flex sx={{width: '100%', height: 443, background: '#7204FF'}} justify="center" align="center">
      <App.Text size={24}>CHART</App.Text>
    </App.Flex>
  )
}
