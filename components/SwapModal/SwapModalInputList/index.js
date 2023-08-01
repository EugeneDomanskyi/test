import { useState } from 'react'
import Image from 'next/image'
import Scrollbars from 'react-custom-scrollbars-2'
import cn from 'classnames'
import { useSelector } from 'react-redux'

import { trackEvent } from '@/libs/analytics.lib'
import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwapModalInputList = ({ tokens, open, variant, onSelect, onClose }) => {
  const [search, setSearch] = useState('')

  const blockchain = useSelector($app.get.blockchain)

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSearch = (val) => {
    setSearch(val)
  }

  const filteredTokens = () => {
    const tempSearch = search.toLowerCase().trim()
    return tokens.filter(item => {
      return tempSearch == '' || tempSearch != '' && (item.name.toLowerCase().includes(tempSearch) || item.currency.toLowerCase().includes(tempSearch))
    })
  }

  const handleSelect = (item) => () => {
    trackEvent('Select Asset', {
      'Network': blockchain.code.toUpperCase(),
      'Token': item.name,
    })
    if (onSelect) {
      onSelect(item.code, variant)
    }
  }

  return (
    <App.Flex column className={cn(styles.container, {[styles.open]: open})}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleClose}>
          <App.Icon icon="cross" color="#fff" />
        </div>

        <App.Flex column gap={[16, 32]} className={styles.headerContent}>
          <App.Flex column align={['center', 'flex-start']} gap={[16, 8]}>
            <App.Text center size={20} weight={700} height={1}>Select token</App.Text>
          </App.Flex>
        </App.Flex>
      </div>

      <App.Flex column gap={16} sx={{ padding: 26 }}>
        <App.TextField
          type="text"
          label="Search tokens"
          labelFixed
          placeholder="Type the name of the token..."
          value={search}
          onChange={handleSearch}
        />

        <Scrollbars
          autoHide
          style={{ width: '100%', height: 264 }}
          renderThumbVertical={props => <div {...props} className="scrollThumb" />}
          renderThumbHorizontal={props => <div {...props} className="scrollThumb" />}
        >
          <div className={styles.content}>
            {filteredTokens().map((item, index) => (
              <App.Flex key={index} row align="center" gap={8} className={cn(styles.item, {[styles.active]: item.active})} onClick={handleSelect(item)}>
                {item.image ? (
                  <Image src={item.image} width={40} height={40} alt="" />
                ) : (
                  <App.Flex className={styles.imagePlaceholder} width={40} height={40} />
                )}

                <App.Flex column gap={6}>
                  <App.Text size={16} weight={700} height={1}>{item.name}</App.Text>
                  <App.Text height={1}>{item.currency}</App.Text>
                </App.Flex>
              </App.Flex>
            ))}
          </div>
        </Scrollbars>
      </App.Flex>
    </App.Flex>
  )
}

export default SwapModalInputList