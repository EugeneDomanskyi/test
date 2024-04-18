import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import cn from 'classnames'

import $app from '@/store/app'
import $token from '@/store/token'

import App from '@/components/App'
// import SidebarSearch from '@/components/Exchange/Sidebar/SidebarSearch'
// import SidebarSort from '@/components/Exchange/Sidebar/SidebarSort'
import SidebarItem from '@/components/Exchange/Sidebar/SidebarItem'

const SidebarSearch = dynamic(() => import('@/components/Exchange/Sidebar/SidebarSearch'), {ssr: false})
const SidebarSort = dynamic(() => import('@/components/Exchange/Sidebar/SidebarSort'), {ssr: false})

import styles from './styles.module.scss'

const Sidebar = ({ version }) => {
  const router = useRouter()
  const urlBlockchain = router.query.blockchain

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const all = useSelector(({ $token }) => $token.all)
  const searched = useSelector(({ $token }) => $token.searched)
  const loading = useSelector(({ $token }) => $token.loading)
  const searching = useSelector(({ $token }) => $token.searching)
  const sort = useSelector(({ $token }) => $token.sort)
  const pages = useSelector($token.get.pages)
  const current = useSelector(({ $token }) => $token.current)

  const mobileContainerRef = useRef()
  const mobileNextRef = useRef()

  const list = searching ? searched : all
  const [sortBy, sortDirection] = sort.split(':')

  useEffect(() => {
    // if (blockchain.code !== urlBlockchain) {
    //   return
    // }

    fetchTokensList()
  }, [blockchain.code, sort, pages.current, urlBlockchain])

  // useEffect(() => {
  //   if (!loading && current?.id && current.blockchain === urlBlockchain) {
  //     const exist = all.find(item => item.id === current.id)
  //     if (!exist) {
  //       dispatch($token.set.all([current, ...all]))
  //     }
  //   }
  // }, [current?.id, loading, urlBlockchain])

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
        dispatch($token.set.pages({current: pages.next ?? 1, append: true}))
      }
    }
  }

  const fetchTokensList = async () => {
    const res = await $token.api.all({
      page: pages.current,
      page_size: pages.perPage,
      chain_id: blockchain.id,
      sort_by: sortBy,
      sort_order: sortDirection,
      verified: true,
    })

    if (res.success) {
      dispatch($token.set.all(res.data))
      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))
    }

    dispatch($token.set.loading(false))
  }

  return (
    <App.Flex column className={cn(styles.container, styles[version])}>
      <App.Flex column>
        <App.Flex center full sx={{ padding: '8px 10px' }}>
          <SidebarSearch />
        </App.Flex>
        <SidebarSort />
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
                  {list.map((item, i) => <SidebarItem key={item.id} item={item} version={version} />)}

                  {pages.next && ! searching && all.length > 0 && (all.length % 20 == 0) ? (
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

export default Sidebar
