import { Grid } from '@mui/material'
import cn from 'classnames'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'

import styles from './styles.module.scss'

const MintModalSelectItem = ({ nft, isEnabled, isChecked, onCheck }) => {
  const handleCheck = () => {
    if (isEnabled && onCheck) {
      onCheck()
    }
  }

  return (
    <Grid item sm={4} xs={6}>
      <AppFlex column gap={12} className={cn(styles.item, {[styles.selected]: isChecked}, {[styles.disabled]: ! isEnabled})} onClick={handleCheck}>
        <div className={styles.preview} style={{backgroundImage: `url('${nft.preview}')`}} />

        <AppFlex column sx={{ padding: '0 8px' }}>
          <AppText>{nft.title}</AppText>
          <AppText nowrap size={10} color="#605884">ID: {nft.id}</AppText>
        </AppFlex>

        <AppFlex center className={cn(styles.label, {[styles.supported]: isEnabled})}>
          <AppText size={12}>
            {isEnabled ? (isChecked ? 'Unselect' : 'Select') : 'NFT Not Supported'}
          </AppText>
        </AppFlex>
      </AppFlex>
    </Grid>
  )
}

export default MintModalSelectItem