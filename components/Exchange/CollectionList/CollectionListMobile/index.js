import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $modal from '@/store/modal'

import App from '@/components/App'
import CollectionListItem from '@/components/Exchange/CollectionList/CollectionListItem'

const CollectionListMobile = () => {
  const dispatch = useDispatch()
  const current = useSelector(({ $collection }) => $collection.current)

  const handleClick = useCallback(() => {
    dispatch($modal.set.show({modal: 'Exchange/CollectionList'< {props: { header: {} }}}))
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