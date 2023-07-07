import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import Scrollbars from 'react-custom-scrollbars-2'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import MintModalSelectItem from '@/components/MintModal/MintModalSelectItem'

import styles from './styles.module.scss'

const MintModalSelect = ({ nfts, token, loading, buttonLoading, onContinue }) => {
  const { isMobile } = usePropsHelper()
  const [availableNftCount, setAvailableNftCount] = useState(0)
  const [selectedIds, setSelectedIds] = useState([])

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

  const handleContinue = () => {
    if (onContinue && ! buttonLoading) {
      if (selectedIds.length) {
        const result = []
        for (const id of selectedIds) {
          result.push({
            id: id,
            amount: 1,
          })
        }

        onContinue(result)
      }
    }
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

  const selectedNftsCount = () => {
    let count = 0
    for (const id of selectedIds) {
      count += 1
    }

    return count
  }

  return (
    <App.Flex column>
      <App.Flex row justify="space-between" align="center" className={styles.box}>
        <App.Text size={[20, 14]} weight={[600, 700]}>{availableNftCount} NFT{availableNftCount > 1 ? 's' : ''} Available</App.Text>

        {availableNftCount > 0 ? (
          <App.Checkbox checked={checkedAll()} onChange={handleCheckAll} label="Select All" />
        ) : null}
      </App.Flex>
      
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
            <App.LoaderBlock height={scrollMaxHeightFunc()} />
          ) : (
            <div className={styles.nfts}>
              {nfts.length > 0 ? (
                <Grid container spacing={3}>
                  {nfts.map((item, index) => (
                    <MintModalSelectItem
                      key={index}
                      nft={item}
                      isEnabled={isEnabled(item)}
                      isChecked={selectedIds.includes(item.id)}
                      onCheck={handleNftCheck(item.id)}
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

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleContinue} loading={buttonLoading} disabled={selectedIds.length == 0 || buttonLoading} sx={{ width: isMobile ? '100%' : 200 }}>
          Mint {selectedNftsCount()} {token.code} NFT20
        </App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default MintModalSelect