# DBET Web/Desktop Wallet - Vechain / Ethereum Version

### Latest Version 2.0.1

Desktop wallet to interact with the Decent.bet token contract on 
the Vechain / Ethereum mainnet. 

## Setup with Thor

1. Enable CORS: `thor solo --on-demand --verbosity 9 --api-cors http://localhost:3100`
2. Configure proper networks to use updated contracts
3. Run with environment variable: ` export THOR_URL=http://localhost:8669;npm start`

## **Features**

- Wallet login using Ethereum private keys/mnemonics.
- Create new wallets using a random mnemonic generator (Using [Ethers](https://github.com/ethers-io/ethers.js)).
- View DBET balances, transactions and send DBETs to other addresses.

## **Technicalities**

Built initially with [Truffle Box](truffle-box.github.io) and [Electron](https://github.com/electron/electron), then migrated to use [react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts). Uses [Ethers](https://github.com/ethers-io/ethers.js) for Wallet creation/verfication and parts of [Web3 1.0](https://github.com/ethereum/web3.js/tree/1.0) for account management.

## **Installation**
1. Clone this repository
2. Install dependencies with `npm install`
3. Rebuild scrypt `npm rebuild`

## **Development**

The mainnet token contract ABIs are included in the build/contracts folder, which would mean
that you wouldn't have to migrate any contracts to your local network. For development, 
    
1. Run the webpack server for front-end hot reloading. 

    ```
    npm start
    ```

2. To build the application for production/working with electron, use the build command. 
A production build will be created in the build folder.

    ```
    npm run build
    ```

3. Deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2)/[serve](https://github.com/zeit/serve) or
   create a packaged electron based executable file using the instructions below.

## **Build**

DBET Wallet uses [electron-builder](https://github.com/electron-userland/electron-builder) 
to build and create installers across all operating systems.

Make sure you run `npm run build` and have the `build` folder in the wallet's root 
directory. Once available, simply call: 

- Windows `npm run dist:windows`
- Linux `npm run dist:linux`
- MacOs `npm run dist:mac`
- All `npm run dist:all`

## **Relase**

DBET Wallet uses GitHub releases.

Make sure you run `npm run build` and have the `build` folder in the wallet's root 
directory. Once available, change the package.json version and call: 

- `npm run release`

A new release will be created on [releases](https://github.com/decent-bet/platform-wallet/releases).

## Exception Logger

Uncaught exceptions are logged with [electron-log](https://github.com/megahertz/electron-log).

## Environment variables

The settings for each environment can be found in Config.ts