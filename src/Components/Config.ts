const ENV_DEVELOPMENT = 'development'
const ENV_STAGING = 'staging'
const ENV_PRODUCTION = 'production'

const CURRENT_ENV = process.env.REACT_APP_NODE_ENV || ENV_PRODUCTION

const STAGING = {
    THOR: 'https://thor-staging.decent.bet',
    GETH: 'wss://geth-staging.decent.bet',
    VEFORGE: 'https://testnet.veforge.com',
    ETHERSCAN: 'https://rinkeby.etherscan.io',
    DEPOSIT_ADDR: '0xb01a9d4caa05e3d5546e6690ac050ff772fdb52d',
    V1_TOKEN_ADDR: '0xf39bf97efa39531b64c93668faf830632950e8de',
    V2_TOKEN_ADDR: '0xdcbd183dde341b6a1fb98b6f482e760dd7385cfd',
    VET_TOKEN_ADDR: '0x98f98B3C770370175C79629Fc3bF4c520785B652',
    V1_UPGRADE_AGENT_ADDR: '0x2139ECD8246594Ef21267EafDAe924130f967a3E',
}

const DEVELOPMENT = {
    THOR: 'https://thor-staging.decent.bet',
    GETH: 'wss://geth-staging.decent.bet',
    VEFORGE: 'https://testnet.veforge.com',
    ETHERSCAN: 'https://rinkeby.etherscan.io',
    DEPOSIT_ADDR: '0xb01a9d4caa05e3d5546e6690ac050ff772fdb52d',
    V1_TOKEN_ADDR: '0xf39bf97efa39531b64c93668faf830632950e8de',
    V2_TOKEN_ADDR: '0xdcbd183dde341b6a1fb98b6f482e760dd7385cfd',
    VET_TOKEN_ADDR: '0x98f98B3C770370175C79629Fc3bF4c520785B652',
    V1_UPGRADE_AGENT_ADDR: '0x2139ECD8246594Ef21267EafDAe924130f967a3E',
}

const PRODUCTION = {
    THOR: 'https://thor.decent.bet',
    GETH: 'wss://geth.decent.bet',
    VEFORGE: 'https://explore.veforge.com',
    ETHERSCAN: 'https://etherscan.io',
    DEPOSIT_ADDR: '0x3f1e4ef0b246eb95fc73f18f6613b799811a739b',
    V1_TOKEN_ADDR: '0x540449e4d172cd9491c76320440cd74933d5691a',
    V2_TOKEN_ADDR: '0x9b68bfae21df5a510931a262cecf63f41338f264',
    VET_TOKEN_ADDR: '0x1b8EC6C2A45ccA481Da6F243Df0d7A5744aFc1f8',
    V1_UPGRADE_AGENT_ADDR: '0x2139ECD8246594Ef21267EafDAe924130f967a3E',
}

const Configs: any = {
    [ENV_PRODUCTION]: PRODUCTION,
    [ENV_DEVELOPMENT]: DEVELOPMENT,
    [ENV_STAGING]: STAGING
}
export class Config {
    static get gethUrl() {
        return this.getKey('GETH')
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

    private static getKey(key) {
        const config = Configs[CURRENT_ENV]
        if (config) {
            return config[key]
        }
        return Configs.ENV_PRODUCTION[key]
    }
}
