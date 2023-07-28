import styles from './styles.module.scss'
import cn from 'classnames'

const AppSwitch = ({width = 52, height = 29, checked, onChange, containerStyle = {}, ...props}) => {
  const handleChange = ({target}) => {
    onChange(target.checked)
  }
  return (
    <label className={cn(styles.container, {[styles.checked]: checked})} style={{width, height, '--translate-x': `${width-height}px`, ...containerStyle}}>
      <input className={styles.input} type="checkbox" checked={checked} onChange={handleChange} />
      <div className={styles.badge} style={{width: height, height: height}}>
        <div className={styles.badgeInner} />
      </div>
    </label>
  )
}

export default AppSwitch
