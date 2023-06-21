import styles from './styles.module.scss'

import AppText from '@/components/AppText'

const AppTabs = ({width = '100%', height = '100%', options, active, onChange}) => {
  const activeIndex = options.findIndex(o => o.key === active)
  return (
    <div className={styles.container} style={{width: width, height: height}}>
      <div className={styles.badge} style={{transform: `translateX(${activeIndex*100}%)`}} />
      {
        options.map((option, i) => {
          const isActive = option.key === active
          return (
            <div key={i} className={styles.option} onClick={() => onChange(option)}>
              <AppText center color={isActive ? '#fff' : 'rgb(195, 197, 203)'} size={12}>{ option.title }</AppText>
            </div>
          )
        })
      }
    </div>
  )
}

export default AppTabs
