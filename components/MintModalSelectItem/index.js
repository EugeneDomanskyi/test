import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'

import AppCheckbox from '@/components/AppCheckbox'
import AppButton from '@/components/AppButton'
import AppTextField from '@/components/AppTextField'

import styles from './styles.module.scss'

const MintModalSelectItem = ({ nft, status, isEnabled, isChecked, onCheck, amount, onAmount }) => {
  const [localAmount, setLocalAmount] = useState(amount)

  useEffect(() => {
    setLocalAmount(amount)
  }, [amount])

  const classes = () => {
    const result = [styles.nftItem]
    if (! isEnabled) {
      result.push(styles.disabled)
    }
    if (isChecked) {
      result.push(styles.checked)
    }
    return result.join(' ')
  }

  const handleCheck = () => {
    if (isEnabled) {
      onCheck()
      onAmount(localAmount)
    }
  }

  const componentStatus = () => {
    return (
      <>
        <span className={styles.nftSelectText}>Select </span>
        <AppCheckbox checked={isChecked} onChange={() => {}} />
      </>
    )
  }

  const handleAmountMinus = (e) => {
    if (localAmount > 1) {
      onAmount(localAmount * 1 - 1)
      setLocalAmount(localAmount * 1 - 1)
    }

  }

  const handleAmountPlus = () => {
    if (localAmount < nft.balance * 1) {
      onAmount(localAmount * 1 + 1)
      setLocalAmount(localAmount * 1 + 1)
    }
  }

  const handleLocalAmountSet = (value) => {
    setLocalAmount(value)
  }

  const handleAmountBlur = () => {
    if (localAmount > nft.balance) {
      onAmount(nft.balance)
      setLocalAmount(nft.balance)
      return
    }

    if (localAmount < 1) {
      onAmount(1)
      setLocalAmount(1)
      return
    }

    onAmount(localAmount)
  }

  return (
    <Grid item xs={6}>
      <div className={classes()} onClick={handleCheck}>
        <div className={styles.nftRow}>
          <div className={styles.nftPreview} style={{backgroundImage: `url('${nft.preview}')`}} />

          <div className={styles.nftInfo}>
            <div className={styles.nftTop}>
              <div className={styles.nftSelect}>
                {isEnabled ? componentStatus() : null}
              </div>

              <div className={styles.nftTitle} title={nft.title}>{nft.title}</div>
            </div>

            <div className={styles.nftId} title={nft.id}>ID: {nft.id}</div>

            {nft.type.toLowerCase() == 'erc1155' ? (
              <div className={styles.nftId} title={nft.id}>Balance: {nft.balance}</div>
            ) : null}
          </div>
        </div>
        
        {nft.type.toLowerCase() == 'erc1155' && isChecked ? (
          <div className={styles.nftAmount} onClick={(e) => e.stopPropagation()}>
            <AppButton onClick={handleAmountMinus} disabled={amount <= 1} style={{width: 33}}>-</AppButton>
            <AppTextField
              type="number"
              value={localAmount}
              variant="nft-amount"
              sx={{width: '100px', textAlign: 'center'}}
              onChange={handleLocalAmountSet}
              onBlur={handleAmountBlur}
            />
            <AppButton onClick={handleAmountPlus} disabled={amount >= nft.balance * 1} style={{width: 33}}>+</AppButton>
          </div>
        ) : null}
      </div>
    </Grid>
  )
}

export default MintModalSelectItem