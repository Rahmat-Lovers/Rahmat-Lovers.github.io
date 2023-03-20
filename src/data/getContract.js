import { ethers } from "ethers"
const tokenAddress = "0xd0EB1C0669E62b43678C97E9C8456b896Fa46E95";
const tokenAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_erc20_addr",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addr",
        "type": "address"
      }
    ],
    "name": "acceptWithdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "canWithdraw",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUnlockedTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "targetBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "targetTime",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "acceptorAddress",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "acceptedByAcceptor",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "cantSetRuleWithdraw",
            "type": "bool"
          }
        ],
        "internalType": "struct Lock.User",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_targetBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_targetTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_acceptorAddress",
        "type": "address"
      }
    ],
    "name": "setRuleWithdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]

export default async (signer) => {
  const contract = new ethers.Contract(tokenAddress, tokenAbi, signer)
  return contract
}