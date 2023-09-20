import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

const TegroShadowText = ({children, color, shadowColor, size, weight, ...props}) => {  
  return (
    <div className={styles.textWrapper}>
      <App.Text className={cn(styles.text, styles.shadowText)} sx={{color: shadowColor, WebkitTextStroke: `2px ${shadowColor}`, fontSize: size, fontWeight: weight}} {...props}>
        { children }
      </App.Text>
      
      <App.Text className={styles.text} sx={{color: color, fontSize: size, fontWeight: weight}} {...props}>
        { children }
      </App.Text>
    </div>
  )
}

export default TegroShadowText
