import App from '../index'

const AppNumber = ({children, size, ...props}) => {
  const string = children ? (['number', 'string'].includes(typeof children) ? children : children.join('')) : ''
  return (
    <App.Text {...props} size={size * (string.length > 14 ? 14/string.length : 1)}>{ string }</App.Text>
  )
}

export default AppNumber
