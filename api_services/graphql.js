import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const getApolloClient = (uri) => {
  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
    connectToDevTools: false,
  })

  return client
}

export const queries = {
  tokenById: gql`
    query token($id: String) {
      token(id: $id) {
        id
        name
        symbol
        decimals
        totalSupply
        volumeUSD
        totalValueLockedUSD
      }
    }
  `,
  tokens:  gql`
    query tokens($skip: Int!, $orderBy: String, $orderDirection: String, $searchText: String, $usdt: String) {
      tokens(first: 20, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { and: [{totalValueLockedUSD_gt: 0}, {derivedETH_gt: 0}, {id_not: $usdt}, {or: [{ name_contains_nocase: $searchText }, { symbol_contains_nocase: $searchText }, { id: $searchText }]}] }) {
        id
        name
        symbol
        decimals
        totalSupply
        volumeUSD
        totalValueLockedUSD
      }
    }
  `,
  tokenDayDatas: gql`
    query tokenDayDatas($first: Int, $ids: [String]) {
      tokenDayDatas(
        where: {token_in: $ids}
        orderBy: date
        orderDirection: desc
        first: $first
      ) {
        high
        low
        priceUSD
        volumeUSD
        date
        token {
          id
        }
      }
    }
  `
}
