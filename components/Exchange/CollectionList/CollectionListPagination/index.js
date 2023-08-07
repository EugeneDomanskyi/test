import { memo } from 'react'

import App from '@/components/App'

const CollectionListPagination = ({ pages, page, loading, onPageChange }) => {
  const handlePage = (type) => () => {
    let continuation = null
    if (type != null) {
      continuation = pages[type]
    }

    if (onPageChange) {
      onPageChange(continuation)
    }
  }

  return (
    <App.Flex row align="center" justify="space-between" gap={24} sx={{ padding: 16 }}>
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

const isEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.pages) == JSON.stringify(nextProps.pages) &&
    prevProps.page == nextProps.page &&
    prevProps.loading == nextProps.loading &&
    prevProps.onPageChange == nextProps.onPageChange
}

export default memo(CollectionListPagination, isEqual)