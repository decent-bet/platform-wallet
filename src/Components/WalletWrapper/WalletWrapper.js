import EthersWrapper from "./EthersWrapper";
import ThorWrapper from "./ThorWrapper";
const constants = require('../Constants')

class WalletWrapper {
    constructor({currency, privateKey, mnemonic}) {
        if (currency.toUpperCase() === 'ETH') {
            return new EthersWrapper({privateKey, mnemonic})
        } else if (currency.toUpperCase() === 'VET') {
            if (constants.WALLET_WRAPPER_USE_ETHERS_FOR_VET) {
                return new EthersWrapper({privateKey, mnemonic, derivationPath: "m/44'/818'/0'/0"})
            } else {
                return new ThorWrapper({privateKey, mnemonic})
            }
        }
    }
}

export default WalletWrapper