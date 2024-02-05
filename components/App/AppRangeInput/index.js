import styles from './styles.module.scss'
import Slider from '@mui/material/Slider'
import cn from 'classnames'
import {SliderThumb} from "@mui/material";
import App from "@/components/App";

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
          track: styles.track,
          thumb: styles.thumb,
          markLabel: styles.markLabel,
          markLabelActive: styles.markLabelActive,
          mark: styles.mark,
        }}
        slots={{
          thumb: (props) => {
            const { children, ...rest } = props
            return (
              <SliderThumb {...rest} size={32}>
                { children }
                <App.Text color={'#7364FF'} size={14} weight={700}>{rest.ownerState.value}</App.Text>
                <svg className={styles.thumbTriangle} width="4" height="4" viewBox="0 0 4 4" fill="none">
                  <path d="M2 4L0 0H4L2 4Z" fill="#fff"/>
                </svg>
              </SliderThumb>
            )
          }
        }}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export default AppRangeInput
