import { Alchemy, Network } from 'alchemy-sdk'

const imageSourceConvert = (imageUrl) => {
  return imageUrl.replace('ipfs.io', 'nftstorage.link')
}

const timestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('fi-FI', {day: '2-digit', month: '2-digit', year: 'numeric'})
}

export default function AlchemyLibrary(network = null) {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    network: Network[network],
  }
  
  const alchemy = new Alchemy(config)

  const methods = {
    getNftsForOwner: async (wallet, standard = null, contractAddresses = [], limit = 100) => {
      const options = { contractAddresses, pageSize: limit }

      let nfts = []
      let result = await alchemy.nft.getNftsForOwner(wallet, options)

      if (result.ownedNfts && result.ownedNfts.length) {
        nfts = nfts.concat(result.ownedNfts)
      }

      while (result.pageKey) {
        options.pageKey = result.pageKey
        result = await alchemy.nft.getNftsForOwner(wallet, options)
        if (result.ownedNfts && result.ownedNfts.length) {
          nfts = nfts.concat(result.ownedNfts)
        }
      }

      const processedNfts = []
      for (const nft of nfts) {
        const temp = {
          balance: nft.balance,
          title: nft.title ? nft.title : ('# ' + nft.tokenId),
          id: nft.tokenId,
          type: nft.tokenType,
          media: [],
          preview: null,
          collectionAddress: nft.contract.address.toLowerCase(),
          collectionName: nft.contract.name || '___',
        }
  
        if (nft.media && nft.media.length) {
          for (const media of nft.media) {
            temp.media.push({
              format: media?.format,
              gateway: media?.gateway,
              preview: media?.thumbnail,
              size: media?.bytes,
              raw: media?.raw,
            })
  
            if ( ! temp.preview) {
              temp.preview = imageSourceConvert(media?.gateway)
            }
          }
        }

        if (standard && standard.toLowerCase() == temp.type.toLowerCase() || ! standard) {
          processedNfts.push(temp)
        }
      }

      return processedNfts
    },

    getNftsForOwnerCollection: async (wallet, address, limit = 100) => {
      const nfts = await methods.getNftsForOwner(wallet, null, [address], limit)
      return nfts
    },

    getNftsForOwnerCollectionCount: async (wallet, address) => {
      const options = {
        contractAddresses: [address],
        omitMetadata: false,
        pageSize: 1,
      }

      const result = await alchemy.nft.getNftsForOwner(wallet, options)
      return result?.totalCount ?? 0
    },

    getOwnersForNft: async (address, id) => {
      const result = await alchemy.nft.getOwnersForNft(address, id)
      return result?.owners || []
    },

    getCollectionsForOwner: async (wallet) => {
      let collections = []
      let result = await alchemy.nft.getContractsForOwner(wallet)

      if (result.contracts && result.contracts.length) {
        collections = collections.concat(result.contracts)
      }

      while (result.pageKey) {
        result = await alchemy.nft.getContractsForOwner(wallet, { pageKey: result.pageKey })
        if (result.contracts && result.contracts.length) {
          collections = collections.concat(result.contracts)
        }
      }

      const proccesedCollections = []
      for (const collection of collections) {
        const floorPrice = await methods.getFloorPrice(collection.address)
        // const ownersCount = await methods.getOwnersCountForCollection(collection.address)
        // const nftsCount = await methods.getNftsCountForCollection(collection.address)
        const ownersCount = 54
        const createdAt = await methods.getContractCreationDate(collection.deployedBlockNumber)

        const temp = {
          id: collection.tokenId,
          symbol: collection.symbol,
          type: collection.tokenType,
          address: collection.address,
          name: collection.name || '___',
          preview: null,
          totalBalance: collection.totalBalance,
          totalSupply: collection.totalSupply,
          floorPrice,
          ownersCount,
          nftsCount: collection.totalBalance,
          createdAt,
          volume: 123,
          stat: {
            topBid: 187.5,
            change: {
              d1: {
                amount: 0.09,
                delta: 'up',
              },
              d7: {
                amount: 0.02,
                delta: 'down',
              },
            },
            volume: {
              m15: 1.5,
              d1: 25.8,
              d7: 53.9,
            },
          }
        }
  
        if (collection.media && collection.media.length) {
          temp.preview = imageSourceConvert(collection.media[0]?.gateway)
        }
  
        proccesedCollections.push(temp)
      }

      return proccesedCollections
    },

    getOwnersCountForCollection: async (address) => {
      let count = 0
      let result = await alchemy.nft.getOwnersForContract(address)
      count += result.owners.length

      while (result.pageKey) {
        result = await alchemy.nft.getOwnersForContract(address, { pageKey: result.pageKey })
        count += result.owners.length
      }

      return count
    },

    getNftsCountForCollection: async (address) => {
      let count = 0
      let result = await alchemy.nft.getNftsForContract(address)
      count += result.nfts.length

      while (result.pageKey) {
        result = await alchemy.nft.getNftsForContract(address, { pageKey: result.pageKey })
        count += result.nfts.length
      }

      return count
    },

    getFloorPrice: async (address) => {
      const price = {
        average: 0,
        currency: 'ETH'
      }

      try {
        const result = await alchemy.nft.getFloorPrice(address)

        let amount = 0
        let count = 0

        if (result.openSea && result.openSea.floorPrice) {
          price.openSea = result.openSea.floorPrice
          amount += result.openSea.floorPrice
          count++
        }

        if (result.looksRare && result.looksRare.floorPrice) {
          price.looksRare = result.looksRare.floorPrice
          amount += result.looksRare.floorPrice
          count++
        }

        if (count > 0) {
          price.average = amount / count
        }
      } catch (error) {
        console.log('getFloorPrice: ', error)
      }

      return price
    },

    getTransfersForCollection: async (address) => {
      let transfers = []
      let result = await alchemy.nft.getTransfersForContract(address)

      if (result.nfts && result.nfts.length) {
        transfers = transfers.concat(result.nfts)
      }

      while (result.pageKey) {
        result = await alchemy.nft.getTransfersForContract(address, { pageKey: result.pageKey })
        if (result.nfts && result.nfts.length) {
          transfers = transfers.concat(result.nfts)
        }
      }
      
      return transfers
    },

    getContractCreationDate: async (block) => {
      let result = await alchemy.core.getBlock(block)
      return timestampToDate(result.timestamp)
    },
  }

  return methods
}