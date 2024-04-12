import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

const Tabs = ({options, active, version, onChange}) => {
  const currentOption = options.find(opt => opt.key === active)
  const currentIndex = options.findIndex(opt => opt.key === active)

  const optionStyle = () => {
    if (active == 'buy') {
      return {
        color: '#B9B8C5',
        active: version == 'mobile' ? '#53F19C' : '#fff',
        size: version == 'mobile' ? 16 : 12,
      }
    } else {
      return {
        color: '#B9B8C5',
        active: version == 'mobile' ? '#FF1D61' : '#fff',
        size: version == 'mobile' ? 16 : 12,
      }
    }
  }

  return (
    <App.Flex className={cn(styles.container, {[styles[version]]: version})}>
      {
        options.map(option => {
          const isActive = option.key === active
          return (
            <App.Flex
              key={option.key}
              flex={1}
              align="center"
              justify="center"
              onClick={() => onChange(option.key)}
              className={cn(styles.option, styles[active], {[styles.active]: isActive})}
            >
              <App.Text color={isActive ? optionStyle().active : optionStyle().color} size={optionStyle().size} weight={600}>{ option.title }</App.Text>
            </App.Flex>
          )
        })
      }
      <div
        className={cn(styles.badge)}
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${currentIndex*100}%)`,
          backgroundColor: currentOption.color,
        }} />
    </App.Flex>
  )
}

export default Tabs