import { memo, useEffect, useRef } from 'react'
import cn from 'classnames'

import App from '@/components/App'
import SidebarSearch from '@/components/Exchange/Sidebar/SidebarSearch'
import SidebarSort from '@/components/Exchange/Sidebar/SidebarSort'
import SidebarItem from '@/components/Exchange/Sidebar/SidebarItem'

import styles from './styles.module.scss'

const Sidebar = ({ items, searched, current, sort, search, searching, searchEmpty, pages, loading, version, type, onSort, onSearch, onPage, onClose, className }) => {
  const mobileContainerRef = useRef()
  const mobileNextRef = useRef()

  const list = searching ? searched : items

  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('resize', handleScroll)
    }
  }, [mobileNextRef.current])

  const handleScroll = () => {
    if (mobileNextRef.current && ! loading) {
      const containerRect = mobileContainerRef.current.getBoundingClientRect()
      const nextRect = mobileNextRef.current.getBoundingClientRect()

      const containerBottom = containerRect.top + containerRect.height
      if (nextRect.top - containerBottom <= 50) {
        if (onPage) {
          onPage(pages.next, true)
        }
      }
    }
  }

  return (
    <App.Flex column className={cn(styles.container, styles[className])}>
      <App.Flex column>
        <App.Flex center full sx={{ padding: '8px 10px' }}>
          <SidebarSearch search={search} loading={loading} onSearch={onSearch} />
        </App.Flex>
        <SidebarSort sort={sort} loading={loading} onSort={onSort} />
      </App.Flex>

      <div className={styles.cardBox}>
        <div className={styles.cardBoxContent} ref={mobileContainerRef} onScroll={handleScroll}>
          {loading ? (
            [...new Array(20)].map((_, i) => {
              const isOdd = i%2
              return (
                <div key={i} className={styles['card-loader']} style={{'--delay': `${i/(isOdd ? 20 : 5)}s`}} />
              )
            })
          ) : (
            <>
              {searching && !list.length ? (
                <App.Text center>No results were found for your search</App.Text>
              ) : (
                <>
                  {list.map((item, i) => {
                    return (
                      <SidebarItem
                        key={item.address}
                        item={item}
                        searching={searching}
                        type={type}
                        isActive={current.address === item.address}
                        onClose={onClose}
                      />
                    )
                  })}

                  {pages.next && ! searching && items.length == 20 ? (
                    <div ref={mobileNextRef}>
                      <App.Flex center full>
                        <App.Loader size={40} />
                      </App.Flex>
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.items) == JSON.stringify(nextProps.items)
    && JSON.stringify(prevProps.searched) == JSON.stringify(nextProps.searched)
    && JSON.stringify(prevProps.current) == JSON.stringify(nextProps.current)
    && prevProps.search == nextProps.search
    && prevProps.searching == nextProps.searching
    && prevProps.searchEmpty == nextProps.searchEmpty
    && prevProps.loading == nextProps.loading
    && prevProps.version == nextProps.version
    && prevProps.type == nextProps.type
    && prevProps.className == nextProps.className
}

export default memo(Sidebar, isEqual)
