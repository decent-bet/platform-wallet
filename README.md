# DBET Web/Desktop Wallet

Web & desktop wallet to interact with the Decent.bet token contract on testnet(s) and the mainnet. 

## **Features**

- Wallet login using Ethereum private keys/mnemonics.
- Create new wallets using a random mnemonic generator (Using [Ethers](https://github.com/ethers-io/ethers.js)).
- Switch between Mainnet, Ropsten and local networks.
- View DBET balances, transactions and send DBETs to other addresses.

## **Technicalities**

Built with [Truffle Box](truffle-box.github.io) and [Electron](https://github.com/electron/electron). Uses [Ethers](https://github.com/ethers-io/ethers.js) for Wallet creation/verfication and parts of [Web3 1.0](https://github.com/ethereum/web3.js/tree/1.0) for account management.

## **Development**

**For in-browser development**

```
	npm run start
```

followed by

```
	npm run electron
```
for hot-reloads on an Electron app

**Build with**

```
	npm run build
```
