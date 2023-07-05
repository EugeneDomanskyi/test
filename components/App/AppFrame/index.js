import { usePropsHelper } from '@/myhooks/props-helper'

import styles from './styles.module.scss'

const AppFrame = ({ children, border, radius, padding = 16, background, blur, width, height, overflow, gradient, sx = {} }) => {
  const { propValue } = usePropsHelper()

  const styleBox = () => {
    const result = {...sx}
    result.padding = propValue(padding)

    if (blur) {
      result.backdropFilter = `blur(${blur}px)`
    }

    if (width) {
      result.width = propValue(width)
    }

    if (height) {
      result.height = propValue(height)
    }

    if (radius) {
      result.borderRadius = propValue(radius)
    }

    return result
  }

  const styleBorder = () => {
    const result = {}
    if (border) {
      result.padding = propValue(border)
    }

    if (radius) {
      result.borderRadius = propValue(radius)
    }

    if (gradient) {
      result.background = propValue(gradient)
    }

    return result
  }

  const styleBackground = () => {
    const result = {}
    if (border) {
      result.inset = propValue(border)

      const backgroundRadius = (propValue(radius, true) ?? 12) - propValue(border, true)
      result.borderRadius = propValue(backgroundRadius)
    }

    if (background) {
      result.background = propValue(background)
    }

    if (radius) {
      const backgroundRadius = propValue(radius, true) - (propValue(border, true) ?? 1) + 1
      result.borderRadius = propValue(backgroundRadius)
    }

    return result
  }

  const styleContent = () => {
    const result = {}
    if (radius) {
      const contentRadius = propValue(radius, true) - (propValue(border, true) ?? 1)
      result.borderRadius = propValue(contentRadius)
    }

    if (overflow) {
      result.overflow = propValue(overflow)
      result.height = overflow == 'hidden' ? '100%' : height
    }

    if (width) {
      result.width = propValue(width)
    }

    if (height) {
      result.height = propValue(height)
    }

    return result
  }

  return (
    <div className={styles.box} style={styleBox()}>
      <div className={styles.border} style={styleBorder()} />
      <div className={styles.background} style={styleBackground()} />
      <div className={styles.content} style={styleContent()}>
        {children}
      </div>
    </div>
  )
}

export default AppFrame