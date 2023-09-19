import styles from './styles.module.scss'
import cn from 'classnames'

const TegroShadowText = ({children, color, shadowColor, size, weight}) => {  
  return (
    <div className={styles.textWrapper}>
      <span className={cn(styles.text, styles.shadowText)} style={{color: shadowColor, WebkitTextStroke: `2px ${shadowColor}`, fontSize: size, fontWeight: weight}}>
        { children }
      </span>
      
      <span className={styles.text} style={{color: color, fontSize: size, fontWeight: weight}}>
        { children }
      </span>
    </div>
  )
}

export default TegroShadowText
