const ethers = require('ethers')

class EthersWrapper {
    constructor({privateKey, mnemonic, derivationPath}) {
        let returnWallet
        if (mnemonic) {
            returnWallet = GuessCurrency.fromMnemonic(mnemonic, derivationPath)  //get privateKey from mnemonic
        }
        else {
            returnWallet = new ethers.Wallet(privateKey)
        }
        return returnWallet
    }
}

export default EthersWrapper