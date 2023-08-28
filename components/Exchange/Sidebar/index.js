import { memo, useCallback, useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'
import SidebarSearch from '@/components/Exchange/Sidebar/SidebarSearch'
import SidebarSort from '@/components/Exchange/Sidebar/SidebarSort'
import SidebarItem from '@/components/Exchange/Sidebar/SidebarItem'
import SidebarPagination from '@/components/Exchange/Sidebar/SidebarPagination'

import styles from './styles.module.scss'

const Sidebar = ({ items, searched, current, sort, search, searching, pages, loading, onSort, onSearch, onPage, onClose, className }) => {
  const list = (searching) ? searched : items

  return (
    <App.Flex column className={cn(styles.container, styles[className])}>
      <App.Flex column gap={16} sx={{ padding: 16 }}>
        <SidebarSearch search={search} loading={loading} onSearch={onSearch} />
        <SidebarSort sort={sort} loading={loading} onSort={onSort} />
      </App.Flex>

      <div className={styles.cardBox}>
        <div className={styles.cardBoxContent}>
          {list.map((item) => {
            return (
              <SidebarItem
                key={item.address}
                item={item}
                searching={searching}
                isActive={current.address === item.address}
                onClose={onClose}
              />
            )
          })}
        </div>
      </div>

      {!searching ? (
        <SidebarPagination pages={pages} loading={loading} onPage={onPage} />
      ) : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.items) == JSON.stringify(nextProps.items) &&
    JSON.stringify(prevProps.searched) == JSON.stringify(nextProps.searched) &&
    JSON.stringify(prevProps.current) == JSON.stringify(nextProps.current) &&
    prevProps.searching == nextProps.searching &&
    prevProps.loading == nextProps.loading &&
    prevProps.className == nextProps.className
}

export default memo(Sidebar, isEqual)
