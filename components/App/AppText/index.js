import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import styles from './styles.module.scss'

const AppText = ({ children, tag = 'p', html, inline, family, size, weight, style, color, gradient, height, spacing, nowrap, lines, uppercase, lowercase, capitalize, center, italic, right, transition, variant, flex, className, id, sx = {}, onClick }) => {
  const { propValue } = usePropsHelper()

  const Tag = inline ? 'span' : tag

  const classes = () => {
    return cn(
      className,
      styles.text,
      {[styles.nowrap]: propValue(nowrap)},
      {[styles.lines]: propValue(lines)},
      {[styles.uppercase]: propValue(uppercase)},
      {[styles.lowercase]: propValue(lowercase)},
      {[styles.capitalize]: propValue(capitalize)},
      {[styles.center]: propValue(center)},
      {[styles.italic]: propValue(italic)},
      {[styles.right]: propValue(right)},
      {[styles[variant]]: propValue(variant)}
    )
  }

  const styleObject = () => {
    const result = {...(typeof onClick === 'function' ? {cursor: 'pointer'} : null), ...sx}

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

  return html ? (
    <Tag id={id} className={classes()} style={styleObject()} onClick={(e) => onClick ? onClick(e) : null} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <Tag id={id} className={classes()} style={styleObject()} onClick={(e) => onClick ? onClick(e) : null}>{children}</Tag>
  )
}

export default AppText