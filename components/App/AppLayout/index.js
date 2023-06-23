import Header from '@/components/Header'

const AppLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default AppLayout