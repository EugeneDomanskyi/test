import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

export default function SectionTitle({children}) {
  const { isMobile } = usePropsHelper()

  return (
    <App.Text size={isMobile ? 20 : 28} weight={700}>
      { children }
    </App.Text>
  )
}