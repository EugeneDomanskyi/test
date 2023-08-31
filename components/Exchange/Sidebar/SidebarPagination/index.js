import { memo, useRef, useEffect } from 'react'

import App from '@/components/App'

const SidebarPagination = ({ pages, loading, onPage }) => {
  const buttonRef = useRef(null)

  // useEffect(() => {
  //   if (buttonRef.current) {
  //     let timerId = setInterval(() => {
  //       buttonRef.current.click()
  //     }, 4000);
  //     setTimeout(() => { clearInterval(timerId) }, 3600000);
  //   }
  // }, [buttonRef])

  const handlePage = (type) => () => {
    let newPage = null
    if (type != null) {
      newPage = pages[type]
    }
    console.log('newPage?', newPage);

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

      <div ref={buttonRef} onClick={handlePage('next')}>
        <App.Button small primary outlined={! pages.next || loading} disabled={! pages.next || loading}>
          Next
          {loading ? (
            <App.Loader size={16} />
          ) : (
            <App.Icon icon="chevron-right" width={16} height={16} />
          )}
        </App.Button>
      </div>
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