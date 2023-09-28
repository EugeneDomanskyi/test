import { usePropsHelper } from '@/myhooks/props-helper'

export default function SectionTitle({children}) {
  const { isMobile } = usePropsHelper()

  return (
    <h1 style={{marign: 0, fontSize: isMobile ? 20 : 28}}>
      { children }
    </h1>
  )
}