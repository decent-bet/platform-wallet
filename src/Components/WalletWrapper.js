const ethers = require('ethers')

class WalletWrapper {
    constructor({currency, privateKey, mnemonic}) {
        if (currency.toUpperCase() === 'ETH') {
            //TODO: if mnemonic then get privateKey from mnemonic and then :
            return new ethers.Wallet(privateKey) // TODO: extend returned object with "currency"?
        } else if (currency.toUpperCase() === 'VET') {
            //TODO: if(config.walletCurrencyVETHandler==='ethers') {
            // return new ethers wallet with key derivation "m/44'/818'/0'/0"
            //}
            return { //wrapper for thor-devkit
                fromMnemonic: (mnemonic) => {
                    // TODO: call thor-devkit
                    /*
                    * // derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0/0`.
                    // defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
                    let privateKey = cry.mnemonic.derivePrivateKey(words)

                    // in recovery process, validation is recommended
                    let ok = cry.mnemonic.validate(words)

                    // encrypt/decrypt private key using Ethereum's keystore scheme
                    let keystore = await cry.Keystore.encrypt(privateKey, 'your password')

                    // throw for wrong password
                    let recoveredPrivateKey = await cry.Keystore.decrypt(keystore, 'your password')

                    // roughly check keystore format
                    ok = cry.Keystore.wellFormed(keystore)
                    * */
                }
            }
        }
    }

    static async guessCurrencyFromPrivateKey(privateKey) {
        //TODO: Check balance in both ETH and VET wallets, return ETH or VET depending on balance. Default to VET
    }

    static async guessCurrencyFromPublicKey(publicKey) {
        //TODO: Check balance in both ETH and VET wallets, return ETH or VET depending on balance. Default to VET
    }

    static async guessCurrencyFromMnemonic(mnemonic) {
        //TODO: Check balance in both ETH and VET wallets, return ETH or VET depending on balance. Default to VET
    }
}

export default WalletWrapper