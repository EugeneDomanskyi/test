const AppHr = ({ height = 1, color = '#fff', ...props }) => {
  return (
    <div style={{ height: height, backgroundColor: color }} {...props} />
  )
}

export default AppHr