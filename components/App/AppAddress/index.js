import AppIcon from '@/components/App/AppIcon'

import styles from './styles.module.scss'

const AppAddress = ({ address, short, small, muted, noCopy, url, align = 'left' }) => {
  const shorterAddress = () => {
    return short && address ? address.slice(0, short) + '...' + address.slice(address.length - short) : address
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
  }

  const classes = () => {
    const result = [styles.text]

    if (muted) {
      result.push(styles.muted)
    }

    if (small) {
      result.push(styles.small)
    }

    if (url) {
      result.push(styles.url)
    }

    return result.join(' ')
  }

  return (
    <div className={[styles.row, styles[align]].join(' ')}>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className={classes()}>{shorterAddress()}</a>
      ) : (
        <span className={classes()}>{shorterAddress()}</span>
      )}

      {!noCopy ? (
        <span className={styles.copy} onClick={handleCopy}>
          <AppIcon icon="copy" />
        </span>
      ) : null}
    </div>
  )
}

export default AppAddress