const ENV_DEVELOPMENT = 'development'
const ENV_PRODUCTION = 'production'

const CURRENT_ENV = process.env.REACT_APP_ENV || ENV_PRODUCTION

const DEVELOPMENT = {
    CHAIN_TAG: '0x27',
    THOR: 'https://thor-staging.decent.bet',
    GETH: 'wss://geth-staging.decent.bet/ws',
    GETH_RPC: 'https://rinkeby.infura.io/v3/d6d6d340ec174822ab1892bf3db85bda',
    VEFORGE: 'https://explore-testnet.vechain.org',
    ETHERSCAN: 'https://rinkeby.etherscan.io',
    DEPOSIT_ADDR: '0x4b484ec17b4b5a16a5adfa8e4b92f74050af24ca',
    V1_TOKEN_ADDR: '0xa48d81beab4a5d68a5623d352889d79a8ec205c9',
    V2_TOKEN_ADDR: '0xf1d5080c0c96a80325148378df1ab7b9c6ceed5d',
    VET_TOKEN_ADDR: '0x510fCddC9424B1bBb328A574f45BfDdB130e1f03',
    V1_UPGRADE_AGENT_ADDR: '0x2139ECD8246594Ef21267EafDAe924130f967a3E',
}

const PRODUCTION = {
    CHAIN_TAG: '0xc7',
    THOR: 'https://thor.decent.bet',
    GETH: 'wss://geth.decent.bet/ws',
    GETH_RPC: 'https://geth.decent.bet/http',
    VEFORGE: 'https://explore.vechain.org',
    ETHERSCAN: 'https://etherscan.io',
    DEPOSIT_ADDR: '0x3f1e4ef0b246eb95fc73f18f6613b799811a739b',
    V1_TOKEN_ADDR: '0x540449e4d172cd9491c76320440cd74933d5691a',
    V2_TOKEN_ADDR: '0x9b68bfae21df5a510931a262cecf63f41338f264',
    VET_TOKEN_ADDR: '0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8',
    V1_UPGRADE_AGENT_ADDR: '0x2139ECD8246594Ef21267EafDAe924130f967a3E',
}

const Configs: any = {
    [ENV_PRODUCTION]: PRODUCTION,
    [ENV_DEVELOPMENT]: DEVELOPMENT
}
export class Config {
    static get chainTag() {
        return this.getKey('CHAIN_TAG')
    }
    static get gethUrl() {
        return this.getKey('GETH')
    }
    static get gethRpcUrl() {
        return this.getKey('GETH_RPC')
    }
    static get thorUrl() {
        return this.getKey('THOR')
    }

    static get veforgeUrl() {
        return this.getKey('VEFORGE')
    }

    static get etherscanUrl() {
        return this.getKey('ETHERSCAN')
    }

    static get depositAddress() {
        return this.getKey('DEPOSIT_ADDR')
    }

    static get vetTokenAddress() {
        return this.getKey('VET_TOKEN_ADDR')
    }

    static get v1TokenAddress() {
        return this.getKey('V1_TOKEN_ADDR')
    }

    static get v2TokenAddress() {
        return this.getKey('V2_TOKEN_ADDR')
    }

    static get v1UpgradeAgentAddress() {
        return this.getKey('V1_UPGRADE_AGENT_ADDR')
    }

    static get env() {
        return CURRENT_ENV
    }

    static get network() {
        return CURRENT_ENV === 'production' ? 'mainnet' : 'testnet'
    }

    private static getKey(key) {
        const config = Configs[CURRENT_ENV]
        if (config) {
            return config[key]
        }
        return Configs.ENV_PRODUCTION[key]
    }
}
