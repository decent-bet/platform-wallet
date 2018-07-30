import {
    cry,
    abi,
    RLP,
    Transaction
} from 'thor-devkit'
import EthersWrapper from "./EthersWrapper";

/**
 * Wrapper for thor-devkit
 */
class ThorWrapper {
    constructor({privateKey, mnemonic}) {
        const wallet = new EthersWrapper({privateKey, mnemonic, derivationPath: "m/44'/818'/0'/0"})

        const thorSpecific = { //TODO: is there value in this abstraction using this as opposed to just using ethers?
            fromMnemonic: () => (cry.mnemonic.derivePrivateKey(mnemonic))
        }

        //TODO: use extend
        return Object.assign({}, wallet, thorSpecific) // TODO: this does not do a deep copy, is that good enough?
    }
}


export default ThorWrapper