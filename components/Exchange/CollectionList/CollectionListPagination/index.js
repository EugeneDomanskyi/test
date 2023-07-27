import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $collection from '@/store/collection'

import App from '@/components/App'

const CollectionListPagination = () => {
  const dispatch = useDispatch()
  const pages = useSelector($collection.get.pages)
  const { loading, page } = useSelector(({$collection}) => $collection)

  const handlePage = (type) => () => {
    let continuation = null
    if (type != null) {
      continuation = pages[type]
    }

    dispatch($collection.set.page(continuation))
    dispatch($collection.set.fetching(true))
  }

  return (
    <App.Flex row align="center" justify="space-between" sx={{ padding: 16 }}>
      <App.Button small primary outlined={! pages.prev} disabled={! pages.prev} onClick={handlePage('prev')}>
        {loading && page == pages.prev ? (
          <App.Loader size={16} />
        ) : (
          <App.Icon icon="chevron-left" color="#fff" />
        )}
        Prev
      </App.Button>

      <App.Button small primary outlined={! pages.next} disabled={! pages.next} onClick={handlePage('next')}>
        Next
        {loading && page == pages.next ? (
          <App.Loader size={16} />
        ) : (
          <App.Icon icon="chevron-right" width={16} height={16} />
        )}
      </App.Button>
    </App.Flex>
  )
}

export default memo(CollectionListPagination, () => true)