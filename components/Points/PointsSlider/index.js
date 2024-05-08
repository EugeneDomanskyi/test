import { useTranslation } from 'react-i18next'
import { Slider, SliderThumb } from "@mui/material"
import cn from 'classnames'

import App from '/components/App'
import styles from './styles.module.scss'

const PointsSlider = ({value, onChange, containerStyle = {}, disabled, ...props}) => {
  const { t } = useTranslation()
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
          markActive: styles.markActive,
        }}
        slots={{
          thumb: (props) => {
            const { children, ...rest } = props
            const current = rest.ownerState.marks.find(item => item.value === rest.ownerState.value)
            const value = current ? current.label * 0.25 : 0
            return (
              <SliderThumb {...rest} size={32}>
                { children }
                <App.Flex column center gap={4} className={styles.label}>
                  <App.Text size={[16, 12]} weight={400} height={1}>{t('Your Points')}</App.Text>
                  <App.Text size={[32, 16]} weight={600} height={1}>{value}</App.Text>
                </App.Flex>
              </SliderThumb>
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
