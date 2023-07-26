import styles from './styles.module.scss'

const AppSwitch = ({width = 52, height = 29, checked, onChange, containerStyle = {}, ...props}) => {
  const handleChange = ({target}) => {
    onChange(target.checked)
  }
  return (
    <label className={styles.container} style={{width, height, '--translate-x': `${width-height}px`, ...containerStyle}}>
      <input className={styles.input} type="checkbox" checked={checked} onChange={handleChange} />
      <div className={styles.badge} style={{width: height, height: height}}>
        <div className={styles.badgeInner} />
      </div>
    </label>
  )
}

export default AppSwitch
