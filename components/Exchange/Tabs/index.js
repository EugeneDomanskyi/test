import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

const Tabs = ({options, active, onChange}) => {
  const currentOption = options.find(opt => opt.key === active)
  const currentIndex = options.findIndex(opt => opt.key === active)
  return (
    <App.Flex className={styles.container}>
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
              sx={{backgroundColor: isActive ? '#1C192F' : 'transparent'}}
              className={styles.option}>
              <App.Text color={isActive ? 'rgba(255,255,255,0.87)' : '#5E5C6B'} size={12} weight={600}>{ option.title }</App.Text>
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