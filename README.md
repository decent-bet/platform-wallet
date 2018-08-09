# DBET Web/Desktop Wallet - Vechain / Ethereum Version

Web & desktop wallet to interact with the Decent.bet token contract on 
the Ethereum mainnet. 

## Setup with Thor

1. Enable CORS: `thor solo --on-demand --verbosity 9 --api-cors http://localhost:3100`
2. Configure proper networks to use updated contracts
3. Run with environment variable: ` export THOR_URL=http://localhost:8669;yarn start`

## **Features**

- Wallet login using Ethereum private keys/mnemonics.
- Create new wallets using a random mnemonic generator (Using [Ethers](https://github.com/ethers-io/ethers.js)).
- View DBET balances, transactions and send DBETs to other addresses.

## **Technicalities**

Built with [Truffle Box](truffle-box.github.io) and [Electron](https://github.com/electron/electron). Uses [Ethers](https://github.com/ethers-io/ethers.js) for Wallet creation/verfication and parts of [Web3 1.0](https://github.com/ethereum/web3.js/tree/1.0) for account management.

## **Installation**
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
2. Clone this repository
3. Execute Yarn inside the repository: `yarn install`

## **Development**

The mainnet token contract ABIs are included in the build/contracts folder, which would mean
that you wouldn't have to migrate any contracts to your local network. For development, 
    
1. Run the webpack server for front-end hot reloading. 

    ```
    yarn start
    ```

2. To build the application for production/working with electron, use the build command. 
A production build will be created in the build_webpack folder.

    ```
    yarn run build
    ```

3. Deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2)/[serve](https://github.com/zeit/serve) or
   create a packaged electron based executable file using the instructions below.

## **Build**

DBET Wallet uses [electron-builder](https://github.com/electron-userland/electron-builder) 
to build and create installers across all operating systems.

Make sure you run `yarn run build` and have the `build_webpack` folder in the wallet's root 
directory. Once available, simply call 

```
yarn run dist
```

Installers will be created in the `dist` folder.