import styles from './styles.module.scss'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import $collection from '@/store/collection'

import App from '@/components/App'
import Tabs from '@/components/Exchange/Tabs'

const TAB_OPTIONS = [
  {key: 'buy', title: 'BUY', color: 'rgb(13, 198, 109)'},
  {key: 'sell', title: 'SELL', color: 'rgb(206, 22, 93)'},
]

const TradeForm = ({collectionId}) => {

  const currentCollection = useSelector($collection.get.collection('address', collectionId))

  console.log(currentCollection)

  const [form, setForm] = useState({price: '0', amount: '0', total: '0'})
  const [currentTab, setCurrentTab] = useState('buy')
  const currentOption = TAB_OPTIONS.find(opt => opt.key === currentTab)

  const handleChangeTab = tab => {
    setCurrentTab(tab)
  }

  const handleChangeForm = field => value => {
    setForm(state => ({
      ...state,
      [field]: value,
    }))
  }

  const handleSubmit = () => {

  }

  return (
    <App.Flex className={styles.container} column>
      <Tabs
        options={TAB_OPTIONS}
        active={currentTab}
        onChange={handleChangeTab} />
      <App.Flex column className={styles.form}>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Price</App.Text>
          <App.TextField
            value={form.price}
            onChange={handleChangeForm('price')} />
        </App.Flex>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Amount</App.Text>
          <App.TextField
            value={form.amount}
            onChange={handleChangeForm('amount')} />
        </App.Flex>
        <App.Flex column sx={{marginBottom: 15}}>
          <App.Text>Total</App.Text>
          <App.TextField
            value={form.total}
            onChange={handleChangeForm('total')} />
        </App.Flex>
        <App.Button variant={currentTab === 'buy' ? 'success' : 'danger'} sx={{marginTop: 'auto'}} onPress={handleSubmit}>
          <App.Text>{ currentOption.title }</App.Text>
        </App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default TradeForm
