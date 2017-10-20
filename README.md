# DBET Web/Desktop Wallet

Web & desktop wallet to interact with the Decent.bet token contract on 
the Ethereum mainnet. 

## **Features**

- Wallet login using Ethereum private keys/mnemonics.
- Create new wallets using a random mnemonic generator (Using [Ethers](https://github.com/ethers-io/ethers.js)).
- View DBET balances, transactions and send DBETs to other addresses.

## **Technicalities**

Built with [Truffle Box](truffle-box.github.io) and [Electron](https://github.com/electron/electron). Uses [Ethers](https://github.com/ethers-io/ethers.js) for Wallet creation/verfication and parts of [Web3 1.0](https://github.com/ethereum/web3.js/tree/1.0) for account management.

## **Installation**

```
npm install
```

## **Development**

The mainnet token contract ABIs are included in the build/contracts folder, which would mean
that you wouldn't have to migrate any contracts to your local network. For development, 
    
1. Run the webpack server for front-end hot reloading. 

    ```
    npm run start
    ```

2. To build the application for production/working with electron, use the build command. 
A production build will be created in the build_webpack folder.

    ```
    npm run build
    ```

3. Deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2)/[serve](https://github.com/zeit/serve) or
   create a packaged electron based executable file using the instructions below.


## **Packaging**

DBET Wallet uses [electron-packager](https://github.com/electron-userland/electron-packager) 
to package and create executables across all operating systems.

Make sure you run _npm run build_ and have the build_webpack folder in the wallet's root 
directory. Once available, simply call the following to build packages for your preferred OS.

**Windows**
```
npm run package-win
```

**OSX**
```
npm run package-osx
```

**Linux**
```
npm run package-linux
```

Packaged builds will be created in the _release-builds_ folder.