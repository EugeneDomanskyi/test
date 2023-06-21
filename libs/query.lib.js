import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon',
  // uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  cache: new InMemoryCache(),
})

export const query = gql`
  query TopTokens100($duration: HistoryDuration!, $chain: Chain!) {
    topTokens(pageSize: 100, page: 1, chain: $chain, orderBy: VOLUME) {
      id
      name
      chain
      address
      symbol
      standard
      market(currency: USD) {
        id
        totalValueLocked {
          id
          value
          currency
          __typename
        }
        price {
          id
          value
          currency
          __typename
        }
        pricePercentChange(duration: $duration) {
          id
          currency
          value
          __typename
        }
        volume(duration: $duration) {
          id
          value
          currency
          __typename
        }
        __typename
      }
      project {
        id
        logoUrl
        __typename
      }
      __typename
    }
  }
`

export const getTokensPrice = (addresses) => {
  const paramsString = `[${addresses.map(el => `"${el.toLowerCase()}"`)}]`
  return client
    .query({
      query: gql`
        query tokens {
          tokens(
            where: {
              id_in: ${paramsString}
            }
            orderBy: totalValueLockedUSD
            orderDirection: desc
            subgraphError: allow
          ) {
            id
            symbol
            name
            derivedETH
            volumeUSD
            volume
            txCount
            totalValueLocked
            feesUSD
            totalValueLockedUSD
            __typename
          }
        }
      `,
    }).then(res => {
      return res.data.tokens.reduce((acc, token) => ({...acc, [token.id]: token}), {})
    })
}

export const getPools = async (tokens) => {
  const promises = tokens.filter(([poolId]) => Boolean(poolId)).map(([poolId, address]) => {
    return client.query({
      query: gql`
        query pools {
          pools(
            first:1
            where: {
              id: "${poolId}"
            }
          ) {
            id
            token0 {
              id
              symbol
            }
            token0Price
            token1 {
              id
              symbol
            }
            token1Price
            totalValueLockedUSD
            totalValueLockedUSDUntracked
            volumeToken0
            volumeToken1
          }
        }
      `}).then(res => {
        const [pool] = res.data.pools
        return {
          address: address,
          pool: pool
        }
      })
  })
  return await Promise.all(promises).then(res => {
    return res.reduce((acc, pool) => {
      return {
        ...acc,
        [pool.address.toLowerCase()]: pool.pool,
      }
    }, {})
  })
}

export const getPoolsAll = async (addresses) => {
  const paramsString = `[${addresses.map(el => `"${el.toLowerCase()}"`)}]`
  return client.query({
    query: gql`
      query pools {
        pools(
          where: {
            id_in: ${paramsString}
          }
          orderBy: totalValueLockedUSD
          orderDirection: desc
          subgraphError: allow
        ) {
          id
          feeTier
          liquidity
          sqrtPrice
          tick
          token0 {
            id
            symbol
            name
            decimals
            derivedETH
            __typename
          }
          token1 {
            id
            symbol
            name
            decimals
            derivedETH
            __typename
          }
          token0Price
          token1Price
          volumeUSD
          volumeToken0
          volumeToken1
          txCount
          totalValueLockedToken0
          totalValueLockedToken1
          totalValueLockedUSD
          __typename
        }
        bundles(where: { id: "1" }) {
          ethPriceUSD
          __typename
        }
      }
    `
  }).then(res => {
    return res.data.pools.reduce((acc, pool) => ({...acc, [pool.token0.id]: pool}), {})
  })
}

export const getPoolDayData = async (poolId) => {
  return client.query({
    query: gql`
      query poolDayDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
        poolDayDatas(
          first: 1000
          skip: $skip
          where: {pool: $address, date_gt: $startTime}
          orderBy: date
          orderDirection: asc
          subgraphError: allow
        ) {
          date
          volumeUSD
          tvlUSD
          feesUSD
          pool {
            feeTier
            __typename
          }
          __typename
        }
      }
    `,
    variables: {
      "address": poolId,
      "startTime": 1619170975,
      "skip": 0
    }
  })
}