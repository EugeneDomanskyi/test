import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import Scrollbars from 'react-custom-scrollbars-2'

import AppCheckbox from '@/components/AppCheckbox'
import AppButton from '@/components/AppButton'
import AppLoader from '@/components/AppLoader'
import MintModalSelectItem from '@/components/MintModalSelectItem'

import styles from './styles.module.scss'

const MintModalSelect = ({ nfts, token, loading, buttonLoading, onSubmit }) => {
  const [availableNftCount, setAvailableNftCount] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])
  const [nftAmount, setNftAmount] = useState({})
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    setAvailableNftCount(nfts.filter(item => isEnabled(item)).length)
  }, [nfts])

  const scrollMaxHeightFunc = () => {
    const height = window ? window.innerHeight : 0
    if (height == 0) {
      return 350
    }
    
    return height -
    183 - //modal header
    177 - //modal footer
    99 - //modal open sea
    100   //padding top + bottom
  }

  const checkedAll = () => {
    return availableNftCount == selectedIds.length
  }

  const handleCheckAll = (checked) => {
    const result = []
    if (checked) {
      for (const item of nfts) {
        if (isEnabled(item)) {
          result.push(item.id)
        }
      }
    }

    setSelectedIds(result)
  }

  const handleNftCheck = (id) => () => {
    const result = [...selectedIds]
    if (selectedIds.includes(id)) {
      result.splice(result.indexOf(id), 1)
    } else {
      result.push(id)
    }
    setSelectedIds(result)
  }

  const handleNftAmount = (id) => (amount) => {
    setNftAmount(state => ({
      ...state,
      [id]: amount,
    }))
  }

  const handleConfirmCheck = (checked) => {
    setConfirm(checked)
  }

  const handleSubmit = () => {
    if (selectedIds.length && confirm && ! buttonLoading) {
      const result = []
      for (const id of selectedIds) {
        result.push({
          id: id,
          amount: (nftAmount[id] || 1)
        })
      }

      onSubmit(result)
    }
  }

  const getMaxAmount = (id) => {
    return nfts.find(item => item.id == id)?.balance ?? 1
  }

  const isEnabled = (nft) => {
    let result = nft.collectionAddress == token.ognft
    if (result && token?.tokenId && token?.tokenId != '*') {
      if (isRegExpRule(token.tokenId)) {
        const regex = new RegExp(token?.tokenId)
        return regex.test(nft.id)
      }

      return nft.id == token?.tokenId
    }
    
    return result
  }

  const isRegExpRule = (str) => {
    try {
      new RegExp(str)
      return true
    } catch (e) {
      return false
    }
  }

  const getNftAmount = (id) => {
    if (nftAmount[id]) {
      return nftAmount[id]
    }

    const amount = getMaxAmount(id)
    setNftAmount(state => ({
      ...state,
      [id]: amount,
    }))

    return amount
  }

  const selectedNftsCount = () => {
    let count = 0
    for (const id of selectedIds) {
      count += (nftAmount[id] || 1) * 1
    }

    return count
  }

  return (
    <>
      <div className={styles.infoRow}>
        <div className={styles.infoLeft}>
          {availableNftCount} NFT{availableNftCount > 1 ? 's' : ''} Available
        </div>

        <div className={styles.infoRight}>
          {selectedIds.length > 0 ? (
            <div className={styles.selectedCount}>{selectedNftsCount()} Selected</div>
          ) : null}

          {availableNftCount > 0 ? (
            <AppCheckbox checked={checkedAll()} onChange={handleCheckAll} label="Select All" />
          ) : null}
        </div>
      </div>
      
      <div className={styles.content}>
        <Scrollbars
          autoHide
          autoHeight
          autoHeightMin={scrollMaxHeightFunc()}
          autoHeightMax={scrollMaxHeightFunc()}
          renderThumbVertical={props => <div {...props} className="scrollThumb" />}
          renderThumbHorizontal={props => <div {...props} className="scrollThumb" />}
        >
          {loading ? (
            <AppLoader size={20} />
          ) : (
            <div className={styles.nfts}>
              {nfts.length > 0 ? (
                <Grid container spacing={2}>
                  {nfts.map((item, index) => (
                    <MintModalSelectItem
                      key={index}
                      nft={item}
                      isChecked={selectedIds.includes(item.id)}
                      onCheck={handleNftCheck(item.id)}
                      amount={getNftAmount(item.id)}
                      onAmount={handleNftAmount(item.id)}
                      isEnabled={isEnabled(item)}
                    />
                  ))}
                </Grid>
              ) : (
                <div className={styles.emptyText}>
                  There are no NFTs connected to this wallet
                </div>
              )}
            </div>
          )}
        </Scrollbars>
      </div>

      <div className={styles.buttonsBox}>
        <AppCheckbox checked={confirm} onChange={handleConfirmCheck} label="You understand that you will be trading these NFTs at a collection level and will most probably not receive the same NFT if you choose to withdraw." />
        
        {availableNftCount > 0 ? (
          <AppButton primary large fullWidth onClick={handleSubmit} loading={buttonLoading} disabled={selectedIds.length == 0 || ! confirm || buttonLoading}>
            Approve {selectedNftsCount()} {token.collection} NFT{selectedNftsCount() > 1 ? 's' : null} Mint
          </AppButton>
        ) : (
          <AppButton primary large fullWidth disabled={selectedIds.length == 0 || ! confirm}>
            No {token.collection} found in wallet
          </AppButton>
        )}
      </div>
    </>
  )
}

export default MintModalSelect