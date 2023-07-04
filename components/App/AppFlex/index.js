import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import styles from './styles.module.scss'

const AppFlex = ({ children, row, column, direction, center, align, justify, gap, flex, width, height, order, className, sx = {}, ...props }) => {
  const { propValue } = usePropsHelper()

  const classes = () => {
    return cn(
      styles.flex,
      {[styles.row]: row && ! direction},
      {[styles.column]: column && ! direction},
      {[styles.center]: propValue(center) && ! align && ! justify},
      className
    )
  }

  const styleObject = () => {
    const result = {...propValue(sx)}

    if (direction) {
      result.flexDirection = propValue(direction)
    }

    if (align) {
      result.alignItems = propValue(align)
    }

    if (justify) {
      result.justifyContent = propValue(justify)
    }

    if (gap) {
      result.gap = propValue(gap)
    }

    if (flex) {
      result.flex = propValue(flex, true)
    }

    if (width) {
      result.width = propValue(width)
    }

    if (height) {
      result.height = propValue(height)
    }

    if (order) {
      result.order = propValue(order, true)
    }

    return result
  }

  return (
    <div className={classes()} style={styleObject()} {...props}>{children}</div>
  )
}

export default AppFlex