import EthersWrapper from "./EthersWrapper";

const constants = require('../Constants')
let web3

/**
 * Functions to attempt to determine which corresponding public address (ETH/VET) has the higher balance.
 * If both 0, returns VET
 */
class GuessCurrency {
    /**
     * Given a private key, attempts to determine which corresponding public address (ETH/VET) has the higher balance.
     * If both 0, returns VET
     * @param privateKey<string>
     * @returns {Promise<string>}
     */
    static async fromPrivateKey(privateKey) {
        const ETHWallet = new EthersWrapper({privateKey})
        const VETWallet = new EthersWrapper({privateKey, derivationPath: constants.VET_DERIVATION_PATH})
        return await this._pickLargestBalance(ETHWallet, VETWallet)
    }


    /**
     * Given a mnemonic, attempts to determine which corresponding public address (ETH/VET) has the higher balance.
     * If both 0, returns VET
     * @param mnemonic<string>
     * @returns {Promise<string>}
     */
    static async fromMnemonic(mnemonic) {
        const ETHWallet = new EthersWrapper({mnemonic})
        const VETWallet = new EthersWrapper({mnemonic, derivationPath: constants.VET_DERIVATION_PATH})
        return await this._pickLargestBalance(ETHWallet, VETWallet)
    }

    /**
     * Given two Ethers-based wallets, ETH and VET, queries the balances of both and depending on which is larger
     * returns ETH or VET as a string. Defaults to VET.
     * @param ETHWallet
     * @param VETWallet
     * @returns {Promise<string>}
     * @private
     */
    static async _pickLargestBalance(ETHWallet, VETWallet) {
        const ETHBalance = await ETHWallet.getBalance()
        const VETBalance = await VETWallet.getBalance()

        return ETHBalance > VETBalance ? "ETH" : "VET"
    }
}

export default GuessCurrency