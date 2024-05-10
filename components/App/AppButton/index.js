import cn from 'classnames'

import AppLoader from '@/components/App/AppLoader'

import styles from './styles.module.scss'

const AppButton = ({children, primary, primary2, default2, secondary2, secondary, variant, outlined, group, rounded, small, large, xl, xs, center, fullWidth, fitWidth, onClick, loading, href, target = "_blank", noPadding, sx, ...props}) => {
  const classes = () => {
    return cn(
      styles.button,
      {[styles.primary]: primary},
      {[styles.primary2]: primary2},
      {[styles.default2]: default2},
      {[styles.secondary2]: secondary2},
      {[styles.secondary]: secondary},
      {[styles[variant]]: variant},
      {[styles.outlined]: outlined},
      {[styles.group]: group},
      {[styles.rounded]: rounded},
      {[styles.small]: small},
      {[styles.large]: large},
      {[styles.xl]: xl},
      {[styles.xs]: xs},
      {[styles.noPadding]: noPadding},
      {[styles.fullWidth]: fullWidth},
      {[styles.fitWidth]: fitWidth},
      {[styles.center]: center},
    )
  }

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
  }

  return href ? (
    <a href={href} target={target} rel="noreferrer" className={classes()} style={sx} {...props}>
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