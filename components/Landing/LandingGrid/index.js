import styles from './styles.module.scss'

const LandingGrid = () => {
  return (
    <div className={styles.container}>
      <div className={styles.back}>
        <div className={styles.glowBox1}>
          <div className={styles.glow1} />
          <div className={styles.glow2} />
        </div>

        <div className={styles.glowBox2}>
          <div className={styles.glow1} />
          <div className={styles.glow2} />
        </div>

        <div className={styles.glowBox3}>
          <div className={styles.glow1} />
          <div className={styles.glow2} />
        </div>

        <div className={styles.grid} />
      </div>
    </div>
  )
}

export default LandingGrid