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
const poolsQuery = `
  query pools {
    pools(
      where: {
        id: "{poolId}"
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