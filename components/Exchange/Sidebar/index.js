import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import cn from 'classnames'

import $app from '@/store/app'
import $token from '@/store/token'
import $collection from '@/store/collection'

import { fetchPrices, getTokens } from '@/api_services/tokens'

import App from '@/components/App'
import SidebarSearch from '@/components/Exchange/Sidebar/SidebarSearch'
import SidebarSort from '@/components/Exchange/Sidebar/SidebarSort'
import SidebarItem from '@/components/Exchange/Sidebar/SidebarItem'

import styles from './styles.module.scss'

const Sidebar = ({ version, type }) => {
  const router = useRouter()
  const urlBlockchain = router.query.blockchain

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const all = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.all : $collection.all)
  const searched = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.searched : $collection.searched)
  const loading = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.loading : $collection.loading)
  const searching = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.searching : $collection.searching)
  const sort = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.sort : $collection.sort)
  const pages = useSelector(type == 'tokens' ? $token.get.pages : $collection.get.pages)
  const tokensPerPage = useSelector(({ $token }) => $token.pages.perPage)
  const current = useSelector(({$token, $collection}) => type === 'tokens' ? $token.current :  $collection.current)

  const mobileContainerRef = useRef()
  const mobileNextRef = useRef()

  const list = searching ? searched : all

  const [sortBy, sortDirection] = sort.split(':')
  let orderBy = sortBy.toLowerCase()
  if (type == 'tokens' && orderBy == 'volume') {
    orderBy = 'volumeUSD'
  }

  if (type == 'tokens' && orderBy == 'price') {
    orderBy = 'derivedETH'
  }

  useEffect(() => {
    if (blockchain.code !== urlBlockchain) {
      return
    }

    if (type == 'tokens') {
      fetchTokensList()
    } else {
      // Fetch collections
    }
  }, [blockchain.code, sort, pages.current, urlBlockchain])

  useEffect(() => {
    if (!loading && current?.id && current.blockchain === urlBlockchain) {
      const exist = all.find(item => item.id === current.id)
      if (!exist) {
        dispatch($token.set.all([current, ...all]))
      }
    }
  }, [current?.id, loading, urlBlockchain])

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
        if (type == 'tokens') {
          dispatch($token.set.pages({current: pages.next ?? 1, append: true}))
        } else {
          dispatch($collection.set.pages({current: pages.next ?? 'init', append: true}))
        }
      }
    }
  }

  const fetchTokensList = async () => {
    const post = {
      currentPage: pages.current,
      perPage: tokensPerPage,
      orderBy: orderBy,
      orderDirection: sortDirection.toLowerCase(),
    }

    const tokens = await getTokens(blockchain, post)
    dispatch($token.set.all(tokens))
    dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))
    const prices = await fetchPrices(blockchain, tokens)
    dispatch($token.set.updatedAll(prices))

    dispatch($token.set.loading(false))
  }

  return (
    <App.Flex column className={cn(styles.container, styles[version])}>
      <App.Flex column>
        <App.Flex center full sx={{ padding: '8px 10px' }}>
          <SidebarSearch type={type} />
        </App.Flex>
        <SidebarSort type={type} />
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
                        key={item.id}
                        item={item}
                        type={type}
                        version={version}
                      />
                    )
                  })}

                  {pages.next && ! searching && (all.length % 20 == 0) ? (
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
