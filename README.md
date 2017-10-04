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

2. Run an electron app with hot-reloads enabled

    ```
    npm run electron
    ```

3. To build the application for production, use the build command. 
A production build will be in the build_webpack folder.

    ```
    npm run build
    ```

4. Deploy the build files using a simple express server and [pm2](https://github.com/Unitech/pm2) or [serve](https://github.com/zeit/serve)
