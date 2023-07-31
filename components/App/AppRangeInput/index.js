import styles from './styles.module.scss'
import Slider from '@mui/material/Slider'
import cn from 'classnames'

const AppRangeInput = ({value, onChange, containerStyle = {}, disabled, ...props}) => {
  const handleChange = (e, value) => {
    onChange(value)
  }

  return (
    <div className={cn(styles.container, {[styles.disabled]: disabled})} style={containerStyle}>
      <Slider
        value={value}
        onChange={handleChange}
        classes={{
          root: styles.root,
          rail: styles.rail,
          thumb: styles.thumb,
        }}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export default AppRangeInput
