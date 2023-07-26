import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import Scrollbars from 'react-custom-scrollbars-2'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SellModalSelectItem from '@/components/Exchange/SellModal/SellModalSelectItem'

import styles from './styles.module.scss'

const MintModalSelect = ({ nfts, amount, onSelect }) => {
  const { isMobile } = usePropsHelper()
  const [selectedIds, setSelectedIds] = useState(nfts.slice(0, amount).map(el => el.token.tokenId))
  const [sweepValue, setSweepValue] = useState(true)

  const scrollMaxHeightFunc = () => {
    return 350
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
    if (onSelect) {
      if (selectedIds.length) {
        const result = []
        for (const id of selectedIds) {
          result.push({
            id: id,
            amount: 1,
          })
        }

        onSelect(result)
      }
    }
  }

  const handleChangeRange = value => {
    if (value*1 === selectedIds.length) {
      return
    }
    if (value*1 > selectedIds.length) {
      const diff = value*1 - selectedIds.length
      const res = []
      nfts.forEach(nft => {
        const exist = selectedIds.find(id => id === nft.token.tokenId)
        if (!exist && !(res.length > diff)) {
          res.push(nft.token.tokenId)
        }
      })
      setSelectedIds(state => [...state, ...res])
    } else {
      const diff = value*1 - selectedIds.length
      const res = [...selectedIds]
      setSelectedIds(res.slice(0, diff))
    }
  }

  return (
    <App.Flex column>
      <div className={styles.content}>
        <App.Flex align="center" justify={'space-between'} sx={{padding: '16px 26px 0px 26px'}}>
          <App.Flex align="center" gap={8}>
            <App.Text size={16} weight={500}>Sweep</App.Text>
            <App.Switch checked={sweepValue} onChange={(val) => setSweepValue(val)} />
          </App.Flex>
          <App.Flex align="center" gap={8}>
            <App.RangeInput
              value={selectedIds.length}
              disabled={!sweepValue}
              onChange={handleChangeRange}
              min={0}
              max={nfts.length} />
            <App.Text size={20} weight={700}>{ selectedIds.length }</App.Text>
          </App.Flex>
        </App.Flex>
        <Scrollbars
          autoHide
          autoHeight
          autoHeightMin={scrollMaxHeightFunc()}
          autoHeightMax={scrollMaxHeightFunc()}
          renderThumbVertical={props => <div {...props} className="scrollThumb" />}
          renderThumbHorizontal={props => <div {...props} className="scrollThumb" />}
        >
          <div className={styles.nfts}>
            {nfts.length > 0 ? (
              <Grid container spacing={3}>
                {nfts.map((item, index) => (
                  <SellModalSelectItem
                    key={index}
                    nft={item.token}
                    isEnabled={true}
                    isChecked={selectedIds.includes(item.token.tokenId)}
                    onCheck={handleNftCheck(item.token.tokenId)}
                  />
                ))}
              </Grid>
            ) : (
              <div className={styles.emptyText}>
                There are no NFTs connected to this wallet
              </div>
            )}
          </div>
        </Scrollbars>
      </div>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleContinue} disabled={selectedIds.length == 0} sx={{ width: isMobile ? '100%' : 200 }}>
          Sell {selectedIds.length} NFTs
        </App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default MintModalSelect