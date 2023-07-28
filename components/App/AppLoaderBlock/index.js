import App from '@/components/App'

const AppLoaderBlock = ({ height = 300, width = '100%', backgroundColor = 'rgba(0,0,0,0.3)', blur = 1, size = 40, color = '#fff', fixed = false }) => {
  const styles = {
    ...(fixed ? {position: 'fixed', inset: 0} : null),
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: `blur(${blur}px)`,
    zIndex: 10,
  }
  return (
    <App.Flex center height={height} width={width} sx={styles}>
      <App.Loader size={size} color={color} />
    </App.Flex>
  )
}

export default AppLoaderBlock