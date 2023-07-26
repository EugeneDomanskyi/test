import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import styles from './styles.module.scss'

const AppContainer = ({ children, fluid, width, height, className, sx = {}, ...props }) => {
  const { propValue } = usePropsHelper()

  const classes = () => {
    return cn(
      styles.container,
      {[styles.fluid]: fluid},
      className,
    )
  }

  const styleObject = () => {
    const result = {...propValue(sx)}

    if (width) {
      result.width = propValue(width)
    }

    if (height) {
      result.height = propValue(height)
    }

    return result
  }

  return (
    <div className={classes()} style={styleObject()} {...props}>
      {children}
    </div>
  )
}

export default AppContainer