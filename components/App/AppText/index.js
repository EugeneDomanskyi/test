import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import styles from './styles.module.scss'

const AppText = ({ children, html, inline, family, size, weight, style, color, gradient, height, spacing, nowrap, lines, uppercase, lowercase, capitalize, center, italic, right, transition, variant, flex, className, id, sx = {}, onClick }) => {
  const { propValue } = usePropsHelper()

  const classes = () => {
    return cn(
      className,
      styles.text,
      {[styles.nowrap]: nowrap},
      {[styles.lines]: lines},
      {[styles.uppercase]: uppercase},
      {[styles.lowercase]: lowercase},
      {[styles.capitalize]: capitalize},
      {[styles.center]: center},
      {[styles.italic]: italic},
      {[styles.right]: right},
      {[styles[variant]]: variant}
    )
  }

  const styleObject = () => {
    const result = {...sx}

    if (family) {
      result.fontFamily = propValue(family)
    }

    if (size) {
      result.fontSize = propValue(size)
    }

    if (weight) {
      result.fontWeight = propValue(weight, true)
    }

    if (style) {
      result.fontStyle = propValue(style)
    }

    if (color) {
      result.color = propValue(color)
    }

    if (gradient) {
      result.background = propValue(gradient)
      result.WebkitBackgroundClip = 'text'
      result.WebkitTextFillColor = 'transparent'
    }

    if (height) {
      result.lineHeight = propValue(height, true)
    }

    if (spacing) {
      result.letterSpacing = propValue(spacing)
    }

    if (lines) {
      result.WebkitLineClamp = propValue(lines, true)
    }

    if (flex) {
      result.flex = propValue(flex, true)
    }

    if (transition) {
      result.transition = `all ${transition}s ease 0s`
    }

    return result
  }

  return inline ? (
    html ? (
      <span id={id} className={classes()} style={styleObject()} onClick={(e) => onClick ? onClick(e) : null} dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <span id={id} className={classes()} style={styleObject()} onClick={(e) => onClick ? onClick(e) : null}>{children}</span>
    )
  ) : (
    html ? (
      <div id={id} className={classes()} style={styleObject()} onClick={(e) => onClick ? onClick(e) : null} dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <div id={id} className={classes()} style={styleObject()} onClick={(e) => onClick ? onClick(e) : null}>{children}</div>
    )
  )
}

export default AppText