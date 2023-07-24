import { Grid } from '@mui/material'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const MintModalSelectItem = ({ nft, isEnabled, isChecked, onCheck }) => {
  const handleCheck = () => {
    if (isEnabled && onCheck) {
      onCheck()
    }
  }

  return (
    <Grid item sm={4} xs={6}>
      <App.Flex center>
        <App.Flex column gap={12} className={cn(styles.item, {[styles.selected]: isChecked}, {[styles.disabled]: ! isEnabled})} onClick={handleCheck}>
          <div className={styles.preview} style={{backgroundImage: `url('${nft.image}')`}} />

          <App.Flex column sx={{ padding: '0 8px' }}>
            <App.Text>{nft.name}</App.Text>
            <App.Text nowrap size={10} color="#605884">ID: {nft.tokenId}</App.Text>
          </App.Flex>

          <App.Flex center className={cn(styles.label, {[styles.supported]: isEnabled})}>
            <App.Text size={12}>
              {isEnabled ? (isChecked ? 'Unselect' : 'Select') : 'NFT Not Supported'}
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </Grid>
  )
}

export default MintModalSelectItem