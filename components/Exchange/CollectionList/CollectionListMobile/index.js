import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $modal from '@/store/modal'

import App from '@/components/App'
import CollectionListItem from '@/components/Exchange/CollectionList/CollectionListItem'

const CollectionListMobile = ({ items, searched, current, className, pages, page, loading, onPageChange, onClose }) => {
  const dispatch = useDispatch()

  const handleClick = useCallback(() => {
    dispatch($modal.set.show({modal: 'Exchange/CollectionList', props: {
      header: {title: 'Select a Collection'},
      className: 'collection-list-modal',
      items, searched, current, className, pages, page, loading, onPageChange,
    }}))
  }, [])

  return (
    <App.Flex column>
      <CollectionListItem
        collection={current}
        withArrow
        onClick={handleClick}
      />
    </App.Flex>
  )
}

export default memo(CollectionListMobile, () => true)