import { memo } from 'react'

import App from '@/components/App'

const SidebarPagination = ({ pages, loading, onPage }) => {
  const handlePage = (type) => () => {
    let newPage = null
    if (type != null) {
      newPage = pages[type]
    }

    if (onPage) {
      onPage(newPage)
    }
  }

  return (
    <App.Flex row align="center" justify="space-between" gap={24} sx={{ padding: 16 }}>
      <App.Button small primary outlined={! pages.prev || loading} disabled={! pages.prev || loading} onClick={handlePage('prev')}>
        {loading ? (
          <App.Loader size={16} />
        ) : (
          <App.Icon icon="chevron-left" color="#fff" />
        )}
        Prev
      </App.Button>

      <App.Button small primary outlined={! pages.next || loading} disabled={! pages.next || loading} onClick={handlePage('next')}>
        Next
        {loading ? (
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

export default memo(SidebarPagination, isEqual)