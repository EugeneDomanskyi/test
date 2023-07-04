import cn from 'classnames'

import AppLoader from '@/components/App/AppLoader'

import styles from './styles.module.scss'

const AppButton = ({children, primary, secondary, variant, outlined, group, rounded, small, large, fullWidth, onClick, loading, href, sx, ...props}) => {
  const classes = () => {
    return cn(
      styles.button,
      {[styles.primary]: primary},
      {[styles.secondary]: secondary},
      {[styles[variant]]: variant},
      {[styles.outlined]: outlined},
      {[styles.group]: group},
      {[styles.rounded]: rounded},
      {[styles.small]: small},
      {[styles.large]: large},
      {[styles.fullWidth]: fullWidth}
    )
  }

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={classes()} style={sx} {...props}>
      {loading ? (<AppLoader size={20} />) : null}
      {children}
    </a>
  ) : (
    <button onClick={handleClick} className={classes()} style={sx} {...props}>
      {loading ? (<AppLoader size={20} />) : null}
      {children}
    </button>
  )
}

export default AppButton