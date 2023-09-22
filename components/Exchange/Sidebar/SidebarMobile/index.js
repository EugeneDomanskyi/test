import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

import App from '@/components/App'
import Sidebar from '@/components/Exchange/Sidebar'
import SidebarItem from '@/components/Exchange/Sidebar/SidebarItem'

import styles from '@/components/App/AppModal/styles.module.scss'

const SidebarMobile = ({ items, searched, current, sort, search, searching, searchEmpty, pages, loading, onSort, onSearch, onPage }) => {
  const [show, setShow] = useState(false)

  const layout = useRef(null)
  const content = useRef(null)

  useEffect(() => {
    if (show) {
      gsap.to(layout.current, {opacity: 1, duration: 0.2})
      gsap.fromTo(content.current, {y: 200}, {y: 0, duration: 0.2})
      document.body.classList.add('modal-open')
    }
  }, [show])

  const handleClick = useCallback(() => {
    setShow(true)
  }, [])

  const handleClose = useCallback(() => {
    Promise.all([
      gsap.to(layout.current, {opacity: 0, duration: 0.2}),
      gsap.fromTo(content.current, {y: 0}, {y: 200, duration: 0.2})
    ]).then(() => {
      document.body.classList.remove('modal-open')
      setShow(false)
    })
  }, [])

  return (
    <App.Flex column>
      <SidebarItem
        item={current}
        withArrow
        onClick={handleClick}
      />

      {show ? (
        <div ref={layout} className={styles.layout}>
          <div ref={content} className={styles.content} onClick={handleClose}>
            <div onClick={e => e.stopPropagation()}>
              <div className={styles.wrapper}>
                <div className={styles.header}>
                  <div className={styles.closeButton} onClick={handleClose}>
                    <App.Icon icon="cross" color="#fff" />
                  </div>

                  <App.Flex column gap={[16, 32]} className={styles.headerContent}>
                    <App.Flex column align={['center', 'flex-start']} gap={[16, 8]}>
                      <App.Text center size={20} weight={700} height={1}>Select an Item</App.Text>
                      <App.Text center size={12} weight={400} height={1} color="#9996B1">&nbsp;</App.Text>
                    </App.Flex>
                  </App.Flex>
                </div>

                <Sidebar
                  items={items}
                  searched={searched}
                  current={current}
                  sort={sort}
                  search={search}
                  searching={searching}
                  searchEmpty={searchEmpty}
                  pages={pages}
                  loading={loading}
                  onSort={onSort}
                  onSearch={onSearch}
                  onPage={onPage}
                  onClose={handleClose}
                  className="collection-list-modal"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.items) == JSON.stringify(nextProps.items) &&
    JSON.stringify(prevProps.searched) == JSON.stringify(nextProps.searched) &&
    JSON.stringify(prevProps.current) == JSON.stringify(nextProps.current) &&
    prevProps.sort == nextProps.sort &&
    prevProps.search == nextProps.search &&
    prevProps.searching == nextProps.searching &&
    prevProps.searchEmpty == nextProps.searchEmpty &&
    JSON.stringify(prevProps.pages) == JSON.stringify(nextProps.pages) &&
    prevProps.loading == nextProps.loading &&
    prevProps.className == nextProps.className
}

export default memo(SidebarMobile, isEqual)