import {
    cry,
    abi,
    RLP,
    Transaction
} from 'thor-devkit'

/**
 * Wrapper for thor-devkit
 */
class ThorWrapper {
    constructor({privateKey, mnemonic}) {
        return {
            // derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0/0`.
            fromMnemonic: () => (cry.mnemonic.derivePrivateKey(mnemonic))
            /*

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

export default ThorWrapper