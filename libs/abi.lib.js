export default {
  erc20: {
    allowance: [{
      "name": "allowance",
      "stateMutability": "view",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }, {
        "internalType": "address",
        "name": "spender",
        "type": "address",
      }],
      "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      }],
    }],

    approve: [{
      "name": "approve",
      "stateMutability": "nonpayable",
      "type": "function",
      "inputs": [{
        "internalType": "address",
        "name": "spender",
        "type": "address",
      }, {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256",
      }],
      "outputs": [{
        "internalType": "bool",
        "name": "",
        "type": "bool",
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
  },
}
