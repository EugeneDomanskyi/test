import styles from './styles.module.scss'
import Slider from '@mui/material/Slider'
import cn from 'classnames'
import {SliderThumb} from "@mui/material"
import Tooltip from '@mui/material/Tooltip'
import App from "@/components/App"

const PointsSlider = ({value, onChange, containerStyle = {}, disabled, ...props}) => {
  const handleChange = (e, value) => {
    onChange(value)
  }

  return (
    <div className={cn(styles.container, {[styles.disabled]: disabled})} style={containerStyle}>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="on"
        classes={{
          root: styles.root,
          rail: styles.rail,
          track: styles.track,
          thumb: styles.thumb,
          markLabel: styles.markLabel,
          markLabelActive: styles.markLabelActive,
          mark: styles.mark,
          valueLabel: styles.valueLabel,
        }}
        slots={{
          thumb: (props) => {
            const { children, ...rest } = props
            return (
              <SliderThumb {...rest} size={32}>
                { children }
              </SliderThumb>
            )
          },

          valueLabel: (props) => {
            const { children, value } = props
            return (
              <Tooltip enterDelay={0} enterTouchDelay={0} placement="top" open={true} arrow title={value}>
                {children}
              </Tooltip>
            )
          },
        }}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export default PointsSlider
