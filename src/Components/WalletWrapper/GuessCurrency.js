import EthersWrapper from "./EthersWrapper";

const constants = require('../Constants')
let web3

class GuessCurrency {
    async _getETHBalance(publicKey) {
        //TODO: switch window.web3 object out with VET provider while awaiting the balance??
        // Or should these functions be in the Helper class
        // Create new Ethers wallet but then it wants a private key?
        return await helper.getWeb3().eth.getBalance(publicKey)
    }

    async _getVETBalance(publicKey) {
        //TODO: switch window.web3 object out with VET provider while awaiting the balance??
        // Or should these functions be in the Helper class
        // Create new Ethers wallet but then it wants a private key?
    }

    async fromPrivateKey(privateKey) {
        //TODO: Check balance in both ETH and VET wallets, return ETH or VET depending on balance. Default to VET
    }

    async fromPublicKey(publicKey) {
        //TODO: Check balance in both ETH and VET wallets, return ETH or VET depending on balance. Default to VET
    }

    /**
     * Given a mnemonic, attempts to determine which corresponding public address (ETH or VET) has the higher balance.
     * @param mnemonic
     * @returns {Promise<string>}
     */
    static async fromMnemonic(mnemonic) {
        const ETHWallet = new EthersWrapper({mnemonic})
        const VETWallet = new EthersWrapper({mnemonic, derivationPath: "m/44'/818'/0'/0/0"})

        const ETHBalance = await ETHWallet.getBalance()
        const VETBalance = await VETWallet.getBalance()

        return ETHBalance > VETBalance ? "ETH" : "VET"
    }
}

export default GuessCurrency