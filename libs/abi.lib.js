export default {
  erc20: {
    getFreeToken: [{
      "name": "getFreeToken",
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "string",
        "name": "tokenID",
        "type":"string",
      }],
      "outputs": [],
    }],

    nextClaimTime: [{
      "name": "nextClaimTime",
      "stateMutability": "view",
      "type": "function",
      "inputs": [{
        "internalType": "string",
        "name": "",
        "type": "string"
      }, {
        "internalType": "address",
        "name": "",
        "type": "address"
      }],
      "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }],
    }],
  },

  erc721: {
    bulkTransfer: [{
      "name": "bulkTransfer",
      "stateMutability": "nonpayable",
      "type": "function",
      "outputs": [{
        "internalType": "bytes4",
        "name": "magicValue",
        "type": "bytes4"
      }],
      "inputs": [{
        "name": "items",
        "type": "tuple[]",
        "internalType": "struct TransferHelperItemsWithRecipient[]",
        "components": [{
          "name": "items",
          "type": "tuple[]",
          "internalType": "struct TransferHelperItem[]",
          "components": [{
            "internalType": "enum ConduitItemType",
            "name": "itemType",
            "type": "uint8"
          }, {
            "internalType": "address",
            "name": "token",
            "type": "address"
          }, {
            "internalType": "uint256",
            "name": "identifier",
            "type": "uint256"
          }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }],
        }, {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }, {
          "internalType": "bool",
          "name": "validateERC721Receiver",
          "type": "bool"
        }],
      }, {
        "internalType": "bytes32",
        "name": "conduitKey",
        "type": "bytes32"
      }],
    }],

    safeTransferFrom: [{
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "from",
        "type": "address"
      }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }, {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }],
    }],

    setApprovalForAll: [{
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }, {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }],
    }],

    isApprovedForAll: [{
      "name": "isApprovedForAll",
      "outputs": [{
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }, {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }],
    }],

    deposit: [{
      "name":"deposit",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function",
      "inputs":[{
        "internalType":"uint256",
        "name":"tokenId",
        "type":"uint256",
      }],
    }],

    balanceOf: [{
      "name": "balanceOf",
      "stateMutability": "view",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "account",
        "type": "address",
      }],
      "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }],
    }],

    decimals: [{
      "name": "decimals",
      "stateMutability": "view",
      "type": "function",
      "inputs": [],
      "outputs": [{
        "internalType": "uint8",
        "name": "",
        "type": "uint8",
      }],
    }],

    depositNFT: [{
      "name": "depositNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256",
      }],
    }],

    depositNFTs: [{
      "name": "depositNFTs",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "uint256[]",
        "name": "_tokenIds",
        "type": "uint256[]",
      }],
    }],

    withdrawNFTs: [{
      "name": "withdrawNFTs",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256",
      }],
    }],
  },

  erc1155: {
    safeTransferFrom: [{
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "from",
        "type": "address"
      }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }, {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }, {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }],
    }],

    safeBatchTransferFrom: [{
      "name":"safeBatchTransferFrom",
      "outputs":[],
      "stateMutability":"nonpayable",
      "type":"function",
      "inputs": [{
        "internalType":"address",
        "name":"_from",
        "type":"address"
      }, {
        "internalType":"address",
        "name":"_to",
        "type":"address"
      }, {
        "internalType":"uint256[]",
        "name":"_ids",
        "type":"uint256[]"
      }, {
        "internalType":"uint256[]",
        "name":"_amounts",
        "type":"uint256[]"
      }, {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }],
    }]
  },

  tkeys: {
    isApprovedForAll: [
      {
        "inputs":[
          {
            "internalType":"address",
            "name":"account",
            "type":"address"
          },
          {
            "internalType":"address",
            "name":"operator",
            "type":"address"
          }
        ],
        "name":"isApprovedForAll",
        "outputs":[
          {
            "internalType":"bool",
            "name":"",
            "type":"bool"
          }
        ],
        "stateMutability":"view",
        "type":"function"
      } 
    ],
    setApprovalForAll: [
      {
        "inputs":[
          {
            "internalType":"address",
            "name":"operator",
            "type":"address"
          },
          {
            "internalType":"bool",
            "name":"approved",
            "type":"bool"
          }
        ],
        "name":"setApprovalForAll",
        "outputs":[
           
        ],
        "stateMutability":"nonpayable",
        "type":"function"
     }
    ],
    enterCampaign: [
      {
        "inputs":[
          {
            "internalType":"uint256",
            "name":"campaignId",
            "type":"uint256"
          },
          {
            "internalType":"uint256[]",
            "name":"tokenIds",
            "type":"uint256[]"
          }
        ],
        "name":"enterCampaign",
        "outputs":[
           
        ],
        "type":"function"
     }
    ],
    balanceOf: [
      {
        "inputs":[
          {
            "internalType":"address",
            "name":"account",
            "type":"address"
          },
          {
            "internalType":"uint256",
            "name":"id",
            "type":"uint256"
          }
        ],
        "name":"balanceOf",
        "outputs":[
          {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
          }
        ],
        "stateMutability":"view",
        "type":"function"
      }
    ]
  }
}
